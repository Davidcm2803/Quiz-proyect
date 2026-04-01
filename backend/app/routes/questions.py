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
        "image": question.image,
    })
    return {"id": str(result.inserted_id)}

@router.delete("/by-quiz/{quiz_id}")
def delete_questions_by_quiz(quiz_id: str):
    from app.db import answers
    oid = ObjectId(quiz_id)
    question_list = list(questions.find({"quiz": oid}))
    question_ids = [q["_id"] for q in question_list]
    if question_ids:
        answers.delete_many({"question": {"$in": question_ids}})
    questions.delete_many({"quiz": oid})
    return {"ok": True}

@router.get("/{question_id}")
def get_question(question_id: str):
    question = questions.find_one({"_id": ObjectId(question_id)})
    return serialize_mongo(question)