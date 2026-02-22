from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PlayerCreate(BaseModel):
    sessionId: str
    nickname: str

class Player(PlayerCreate):
    score: int = 0
    joined_at: datetime
