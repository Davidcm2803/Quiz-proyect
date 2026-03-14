from fastapi import APIRouter
from datetime import datetime
from bson import ObjectId
from app.db import quizzes, questions, answers
from app.models.quiz import QuizCreate, generate_pin
from app.utils.serializers import serialize_mongo

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


@router.post("/")
def create_quiz(quiz: QuizCreate):
    pin = generate_pin(quizzes)
    result = quizzes.insert_one({
        "title": quiz.title,
        "description": quiz.description,
        "creator": ObjectId(quiz.creator),
        "questions": [],
        "started": False,
        "pin": pin,
        "createdAt": datetime.utcnow(),
    })
    return {"id": str(result.inserted_id), "pin": pin}


@router.patch("/{quiz_id}")
def update_quiz_questions(quiz_id: str, payload: dict):
    question_ids = [ObjectId(qid) for qid in payload.get("questions", [])]
    quizzes.update_one(
        {"_id": ObjectId(quiz_id)},
        {"$set": {"questions": question_ids}}
    )
    return {"ok": True}


@router.get("/")
def get_all_quizzes():
    return [serialize_mongo(q) for q in quizzes.find()]


@router.get("/full/by-pin/{pin}")
def get_quiz_full(pin: int):
    quiz = quizzes.find_one({"pin": pin})
    if not quiz:
        return None

    question_ids = quiz.get("questions", [])
    result = serialize_mongo(quiz.copy())
    full_questions = []

    for qid in question_ids:
        oid = qid if isinstance(qid, ObjectId) else ObjectId(str(qid))
        question = questions.find_one({"_id": oid})
        if not question:
            continue
        q = serialize_mongo(question.copy())
        q["answers"] = [
            serialize_mongo(a.copy())
            for a in answers.find({"question": oid})
        ]
        full_questions.append(q)

    result["questions"] = full_questions
    return result


@router.get("/by-pin/{pin}")
def get_quiz_by_pin(pin: int):
    quiz = quizzes.find_one({"pin": pin})
    return serialize_mongo(quiz)


@router.get("/{quiz_id}")
def get_quiz(quiz_id: str):
    quiz = quizzes.find_one({"_id": ObjectId(quiz_id)})
    return serialize_mongo(quiz)


@router.delete("/{quiz_id}")
def delete_quiz(quiz_id: str):
    quizzes.delete_one({"_id": ObjectId(quiz_id)})
    return {"ok": True}