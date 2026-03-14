from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.utils.ws_manager import WSManager
from app.db import rankings
from bson import ObjectId
from datetime import datetime
import json

router = APIRouter()
manager = WSManager()


@router.websocket("/ws/{room_id}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, player_id: str):
    await manager.connect(room_id, player_id, websocket)

    try:
        while True:
            data = await websocket.receive_text()
            data = json.loads(data)
            event = data.get("event")

            if event == "joinRoom":
                await manager.broadcast(room_id, {
                    "event": "playerJoined",
                    "playerId": player_id
                })

            elif event == "startQuiz":
                await manager.broadcast(room_id, {
                    "event": "quizStarted"
                })

            elif event == "newQuestion":
                question = data.get("question")
                await manager.broadcast(room_id, {
                    "event": "newQuestion",
                    "question": question
                })

            elif event == "submitAnswer":
                question_id = data.get("questionId")
                answer = data.get("answer")
                points = data.get("points", 0)

                if manager.has_answered(room_id, question_id, player_id):
                    await websocket.send_json({
                        "event": "error",
                        "message": "Duplicate answer not allowed"
                    })
                    continue

                # suma los puntos que calculó el frontend
                if points > 0:
                    manager.update_score(room_id, player_id, points)

                await manager.broadcast(room_id, {
                    "event": "answerSubmitted",
                    "playerId": player_id
                })

            elif event == "updateScore":
                room = manager.rooms.get(room_id)
                scores = room.scores if room else {}
                await manager.broadcast(room_id, {
                    "event": "scoreUpdate",
                    "scores": scores
                })

            elif event == "endQuiz":
                room = manager.rooms.get(room_id)
                if room:
                    sorted_scores = sorted(
                        [(pid, score) for pid, score in room.scores.items() if pid != "host"],
                        key=lambda x: x[1],
                        reverse=True
                    )
                    for position, (pid, score) in enumerate(sorted_scores, start=1):
                        rankings.insert_one({
                            "_id": ObjectId(),
                            "session": room_id,
                            "player": pid,
                            "position": position,
                            "final_score": score,
                            "date": datetime.utcnow(),
                        })

                    await manager.broadcast(room_id, {
                        "event": "quizEnded",
                        "scores": dict(sorted_scores)
                    })

    except WebSocketDisconnect:
        manager.disconnect(room_id, player_id)