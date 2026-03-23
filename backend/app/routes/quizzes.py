from fastapi import APIRouter, HTTPException, Header
from datetime import datetime
from bson import ObjectId
from jose import jwt, JWTError

from app.db import quizzes, questions, answers, users
from app.models.quiz import QuizCreate, generate_pin
from app.utils.serializers import serialize_mongo
from app.utils.security import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


def get_current_user_from_token(authorization: str = Header(default=None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token no proporcionado")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido")

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Token inválido")

        db_user = users.find_one({"_id": ObjectId(user_id)})
        if not db_user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        return db_user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")


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
def get_user_quizzes(authorization: str = Header(default=None)):
    db_user = get_current_user_from_token(authorization)

    user_quizzes = []
    for quiz in quizzes.find({"creator": db_user["_id"]}):
        serialized = serialize_mongo(quiz)
        user_quizzes.append(serialized)

    return user_quizzes


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
def delete_quiz(quiz_id: str, authorization: str = Header(default=None)):
    db_user = get_current_user_from_token(authorization)

    quiz = quizzes.find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz no encontrado")

    if quiz.get("creator") != db_user["_id"]:
        raise HTTPException(status_code=403, detail="No puedes eliminar un quiz que no te pertenece")

    question_ids = quiz.get("questions", [])

    for question_id in question_ids:
        answers.delete_many({"question": question_id})

    questions.delete_many({"quiz": quiz["_id"]})
    quizzes.delete_one({"_id": quiz["_id"]})

    return {"ok": True}