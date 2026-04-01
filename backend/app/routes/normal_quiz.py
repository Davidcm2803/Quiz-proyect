from fastapi import APIRouter, HTTPException
from app.db import quizzes, questions, answers, rankings
from app.utils.serializers import serialize_mongo
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/normal", tags=["Normal Quiz"])


def get_quiz_full(pin: int) -> Optional[dict]:
    quiz = quizzes.find_one({"pin": pin})
    if not quiz:
        return None

    question_ids = quiz.get("questions", [])
    result = serialize_mongo(quiz.copy())

    oids_ordered = [
        qid if isinstance(qid, ObjectId) else ObjectId(str(qid))
        for qid in question_ids
    ]

    questions_by_id = {}
    for oid in oids_ordered:
        question = questions.find_one({"_id": oid})
        if not question:
            continue
        q = serialize_mongo(question.copy())
        q["answers"] = [
            serialize_mongo(a.copy())
            for a in answers.find({"question": oid})
        ]
        questions_by_id[str(oid)] = q

    result["questions"] = [
        questions_by_id[str(oid)]
        for oid in oids_ordered
        if str(oid) in questions_by_id
    ]
    return result


@router.get("/quiz/{pin}")
def fetch_quiz(pin: int):
    quiz = get_quiz_full(pin)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz no encontrado")
    if quiz.get("mode") != "normal":
        raise HTTPException(status_code=400, detail="Este quiz no es modo normal")
    return quiz


class AnswerRecord(BaseModel):
    question_id: str
    answer: str       # "correct" | "partial" | "wrong"
    points: int
    time_used: float


class SubmitResultRequest(BaseModel):
    pin: int
    player: str
    total_score: int
    answers: List[AnswerRecord]


@router.post("/submit")
def submit_result(body: SubmitResultRequest):
    quiz = quizzes.find_one({"pin": body.pin})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz no encontrado")
    existing = list(
        rankings.find({"session": str(body.pin), "mode": "normal"})
        .sort("final_score", -1)
    )
    position = 1
    for r in existing:
        if r.get("final_score", 0) > body.total_score:
            position += 1

    rankings.insert_one({
        "_id": ObjectId(),
        "session": str(body.pin),
        "player": body.player,
        "position": position,
        "final_score": body.total_score,
        "mode": "normal",
        "answers": [a.dict() for a in body.answers],
        "date": datetime.utcnow(),
    })

    return {"ok": True, "position": position, "total_score": body.total_score}


@router.get("/results/{pin}")
def get_results(pin: int):
    results = list(
        rankings.find({"session": str(pin), "mode": "normal"})
        .sort("final_score", -1)
    )
    return [serialize_mongo(r) for r in results]