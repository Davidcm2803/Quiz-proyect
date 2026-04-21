from pymongo import MongoClient
import os

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://admin:admin1234@localhost:27017/?authSource=admin")

client = MongoClient(MONGO_URI)

db = client["quizdb"]

players = db.players
quizzes = db.quizzes
questions = db.questions
answers = db.answers
sessions = db.sessions
rankings = db.rankings
users = db.users