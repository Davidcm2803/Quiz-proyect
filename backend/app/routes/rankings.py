from fastapi import APIRouter
from bson import ObjectId
from app.db import rankings
from app.utils.serializers import serialize_mongo

router = APIRouter(prefix="/rankings", tags=["Rankings"])


@router.get("/by-session/{session_id}")
def get_rankings_by_session(session_id: str):
    return [
        serialize_mongo(r)
        for r in rankings.find({"session": session_id}).sort("position", 1)
    ]


@router.get("/by-player/{player_id}")
def get_rankings_by_player(player_id: str):
    return [
        serialize_mongo(r)
        for r in rankings.find({"player": player_id}).sort("position", 1)
    ]