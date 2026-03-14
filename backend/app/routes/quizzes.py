from fastapi import APIRouter, HTTPException
from app.models.quiz import QuizCreate, Quiz
import random

router = APIRouter()

quizzes_db = []

def generate_code():
    return str(random.randint(100000, 999999))

def generate_unique_code():
    while True:
        code = generate_code()
        exists = any(q["code"] == code for q in quizzes_db)
        if not exists:
            return code


@router.post("/quizzes")
def create_quiz(data: QuizCreate):

    for quiz in quizzes_db:
        if quiz["title"].lower() == data.title.lower():
            raise HTTPException(
                status_code=400,
                detail="Ya existe un quiz con ese nombre"
            )

    if not data.questions:
        raise HTTPException(400, "Debe haber al menos una pregunta")

    for q in data.questions:
        if not q.text:
            raise HTTPException(400, "Pregunta vacía")

        if not q.answers:
            raise HTTPException(400, "La pregunta debe tener respuestas")

        correct = any(a.is_correct for a in q.answers)

        if not correct:
            raise HTTPException(
                400,
                "Debe haber una respuesta correcta"
            )

    code = generate_unique_code()

    quiz = Quiz(
        title=data.title,
        questions=data.questions,
        code=code
    )

    quizzes_db.append(quiz.dict())

    return {
        "message": "Quiz creado",
        "code": code
    }
