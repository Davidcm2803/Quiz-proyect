from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SessionCreate(BaseModel):
    quiz: Optional[str] = None 
    host: str
    pin: int
    status: str = "waiting"      # "waiting active finished"
    current_question: int = 0
    started_at: Optional[datetime] = None

class Session(SessionCreate):
    createdAt: Optional[datetime] = None