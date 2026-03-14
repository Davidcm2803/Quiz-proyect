from fastapi import APIRouter
from bson import ObjectId
from app.db import questions
from app.models.question import QuestionCreate
from app.utils.serializers import serialize_mongo

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.post("/")
def create_question(question: QuestionCreate):
    print("payload recibido:", question.dict())
    result = questions.insert_one({
        "quiz": ObjectId(question.quiz),
        "text": question.text,
        "points": question.points,
        "time": question.time,
        "answerType": question.answerType,
    })
    return {"id": str(result.inserted_id)}


@router.get("/{question_id}")
def get_question(question_id: str):
    question = questions.find_one({"_id": ObjectId(question_id)})
    return serialize_mongo(question)