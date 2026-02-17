from fastapi import APIRouter
from datetime import datetime
from bson import ObjectId
from app.db import players
from app.models.player import PlayerCreate
from app.utils.serializers import serialize_mongo

router = APIRouter(prefix="/players", tags=["Players"])


@router.post("/")
def create_player(player: PlayerCreate):
    result = players.insert_one({
        "sessionId": ObjectId(player.sessionId),
        "nickname": player.nickname,
        "score": 0,
        "joined_at": datetime.utcnow()
    })

    return {"id": str(result.inserted_id)}


@router.get("/")
def get_players():
    return [serialize_mongo(p) for p in players.find()]


@router.get("/{player_id}")
def get_player(player_id: str):
    player = players.find_one({"_id": ObjectId(player_id)})
    return serialize_mongo(player)
