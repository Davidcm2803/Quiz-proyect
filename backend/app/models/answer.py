from pydantic import BaseModel

class AnswerCreate(BaseModel):
    question: str
    text: str
    is_correct: bool