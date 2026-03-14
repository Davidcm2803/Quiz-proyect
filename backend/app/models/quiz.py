from pydantic import BaseModel, Field
from typing import List
import uuid

class Answer(BaseModel):
    text: str
    is_correct: bool

class Question(BaseModel):
    text: str
    answers: List[Answer]

class QuizCreate(BaseModel):
    title: str = Field(..., min_length=1)
    questions: List[Question]

class Quiz(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    questions: List[Question]
    code: str
=======
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

