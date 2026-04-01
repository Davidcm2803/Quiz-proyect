from fastapi import APIRouter
from bson import ObjectId
from app.db import answers
from app.models.answer import AnswerCreate
from app.utils.serializers import serialize_mongo

router = APIRouter(prefix="/answers", tags=["Answers"])


@router.post("/")
def create_answer(answer: AnswerCreate):
    result = answers.insert_one({
        "question": ObjectId(answer.question),
        "text": answer.text,
        "is_correct": answer.is_correct,
    })

    return {"id": str(result.inserted_id)}


@router.get("/by-question/{question_id}")
def get_answers_for_question(question_id: str):
    return [
        serialize_mongo(a)
        for a in answers.find({"question": ObjectId(question_id)})
    ]