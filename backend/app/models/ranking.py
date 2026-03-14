from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RankingCreate(BaseModel):
    session: str 
    player: str
    position: int
    final_score: int

class Ranking(RankingCreate):
    date: Optional[datetime] = None