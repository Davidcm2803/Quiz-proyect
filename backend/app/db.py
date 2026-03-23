from pymongo import MongoClient

client = MongoClient("mongodb://127.0.0.1:27017")

db = client["quizdb"]

players = db.players
quizzes = db.quizzes
questions = db.questions
answers = db.answers
sessions = db.sessions
rankings = db.rankings
users = db.users