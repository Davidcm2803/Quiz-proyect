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
)

app = FastAPI(title="Quiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(players.router)
app.include_router(quizzes.router)
app.include_router(questions.router)
app.include_router(answers.router)
app.include_router(sessions.router)
#app.include_router(rankings.router)
app.include_router(users.router)