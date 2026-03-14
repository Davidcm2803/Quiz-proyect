from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import random


def generate_pin(db_quizzes) -> int:
    while True:
        pin = random.randint(100000, 999999)
        if not db_quizzes.find_one({"pin": pin}):
            return pin


class QuizCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    creator: str


class Quiz(QuizCreate):
    questions: List[str] = []
    started: bool = False
    pin: Optional[int] = None
    createdAt: datetime