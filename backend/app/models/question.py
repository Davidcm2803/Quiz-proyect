from pydantic import BaseModel
from typing import Optional

class QuestionCreate(BaseModel):
    quiz: str
    text: str
    points: int
    time: int
    answerType: Optional[str] = "single"
    image: Optional[str] = None