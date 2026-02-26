# app/routes/sessions.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.utils.ws_manager import WSManager
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

            # 🔹 joinRoom
            if event == "joinRoom":
                await manager.broadcast(room_id, {
                    "event": "playerJoined",
                    "playerId": player_id
                })

            # 🔹 startQuiz
            elif event == "startQuiz":
                await manager.broadcast(room_id, {
                    "event": "quizStarted"
                })

            # 🔹 sendQuestion
            elif event == "newQuestion":
                question = data.get("question")

                await manager.broadcast(room_id, {
                    "event": "newQuestion",
                    "question": question
                })

            # 🔹 submitAnswer
            elif event == "submitAnswer":
                question_id = data.get("questionId")
                answer = data.get("answer")

                # Prevent duplicate answers
                if manager.has_answered(room_id, question_id, player_id):
                    await websocket.send_json({
                        "event": "error",
                        "message": "Duplicate answer not allowed"
                    })
                    continue

                # Example scoring logic
                if answer == "correct":
                    manager.update_score(room_id, player_id, 100)

                await manager.broadcast(room_id, {
                    "event": "answerSubmitted",
                    "playerId": player_id
                })

            # 🔹 updateScore
            elif event == "updateScore":
                room = manager.rooms.get(room_id)

                await manager.broadcast(room_id, {
                    "event": "scoreUpdate",
                    "scores": room.scores if room else {}
                })

    except WebSocketDisconnect:
        manager.disconnect(room_id, player_id)