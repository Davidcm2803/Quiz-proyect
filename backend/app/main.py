from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    players,
    quizzes,
    questions,
    answers,
    sessions,
    rankings,
    users,
    normal_quiz
)

app = FastAPI(title="Quiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(players.router)
app.include_router(quizzes.router)
app.include_router(questions.router)
app.include_router(answers.router)
app.include_router(sessions.router)
app.include_router(rankings.router)
app.include_router(users.router)
app.include_router(normal_quiz.router)