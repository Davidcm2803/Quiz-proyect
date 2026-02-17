from fastapi import FastAPI
from app.routes import (
    players,
    quizzes,
    questions,
    answers,
    sessions,
    rankings
)

app = FastAPI(title="Quiz API")

app.include_router(players.router)
#app.include_router(quizzes.router)
#app.include_router(questions.router)
#app.include_router(answers.router)
#app.include_router(sessions.router)
#app.include_router(rankings.router)
