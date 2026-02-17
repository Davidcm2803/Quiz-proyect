from pymongo import MongoClient

client = MongoClient("mongodb://admin:admin1234@localhost:27017/?authSource=admin")

db = client["quizdb"]

players = db.players
quizzes = db.quizzes
questions = db.questions
answers = db.answers
sessions = db.sessions
rankings = db.rankings
