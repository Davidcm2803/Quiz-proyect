# app/routes/quizzes.py
from fastapi import APIRouter
from datetime import datetime
from bson import ObjectId
from app.db import quizzes
from app.models.quiz import QuizCreate
from app.utils.serializers import serialize_mongo

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


@router.post("/")
def create_quiz(quiz: QuizCreate):
    result = quizzes.insert_one({
        "title": quiz.title,
        "description": quiz.description,
        "creator": ObjectId(quiz.creator),
        "questions": [],
        "started": False,
        "createdAt": datetime.utcnow(),
    })

    return {"id": str(result.inserted_id)}


@router.patch("/{quiz_id}")
def update_quiz_questions(quiz_id: str, payload: dict):
    quizzes.update_one(
        {"_id": ObjectId(quiz_id)},
        {"$set": {"questions": payload.get("questions", [])}}
    )
    return {"ok": True}


@router.get("/{quiz_id}")
def get_quiz(quiz_id: str):
    quiz = quizzes.find_one({"_id": ObjectId(quiz_id)})
    return serialize_mongo(quiz)