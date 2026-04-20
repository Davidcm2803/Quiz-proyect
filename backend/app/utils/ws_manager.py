# app/utils/ws_manager.py

from fastapi import WebSocket
from typing import Dict


class QuizRoom:
    def __init__(self):
        self.connections: Dict[str, WebSocket] = {}
        self.scores: Dict[str, int] = {}
        self.answers_submitted: Dict[str, set] = {}  # question_id -> set(player_ids)


class WSManager:
    def __init__(self):
        self.rooms: Dict[str, QuizRoom] = {}

    async def connect(self, room_id: str, player_id: str, websocket: WebSocket):
        await websocket.accept()

        if room_id not in self.rooms:
            self.rooms[room_id] = QuizRoom()

        room = self.rooms[room_id]
        room.connections[player_id] = websocket

        if player_id not in room.scores:
            room.scores[player_id] = 0

        print(f"[CONNECT] {player_id} joined {room_id}")

    def disconnect(self, room_id: str, player_id: str):
        room = self.rooms.get(room_id)
        if not room:
            return

        room.connections.pop(player_id, None)
        room.scores.pop(player_id, None)

        print(f"[DISCONNECT] {player_id} left {room_id}")

    async def broadcast(self, room_id: str, message: dict):
        room = self.rooms.get(room_id)
        if not room:
            return

        for connection in room.connections.values():
            await connection.send_json(message)

    def has_answered(self, room_id: str, question_id: str, player_id: str) -> bool:
        room = self.rooms.get(room_id)
        if not room:
            return False

        if question_id not in room.answers_submitted:
            room.answers_submitted[question_id] = set()

        if player_id in room.answers_submitted[question_id]:
            return True

        room.answers_submitted[question_id].add(player_id)
        return False

    def update_score(self, room_id: str, player_id: str, points: int):
        room = self.rooms.get(room_id)
        if not room:
            return

        room.scores[player_id] += points