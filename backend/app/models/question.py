from pydantic import BaseModel

class QuestionCreate(BaseModel):
    quiz: str
    text: str
    points: int
    time: int