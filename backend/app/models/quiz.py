from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class QuizCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    creator: str

class Quiz(QuizCreate):
    questions: List[str] = []
    started: bool = False
    createdAt: datetime