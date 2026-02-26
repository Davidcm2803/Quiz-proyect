// Use the database
db = db.getSiblingDB("quizdb");

/* ============================
   COLLECTIONS (like tables)
   ============================ */

db.createCollection("players");
db.createCollection("questions");
db.createCollection("answers");
db.createCollection("quizzes");
db.createCollection("sessions");
db.createCollection("rankings");
db.createCollection("users");


/* ============================
   INSERT INITIAL DATA
   ============================ */


const session = db.sessions.insertOne({
    _id: ObjectId(),
    quiz: null,
    host: "Sebas",
    pin: 123456,
    status: "waiting",
    current_question: 0,
    started_at: null,
    createdAt: new Date()
});

const player = db.players.insertOne({
    _id: ObjectId(),
    session: session.insertedId,
    nickname: "Sebas",
    score: 0,
    joined_at: new Date()
});

const quiz = db.quizzes.insertOne({
  _id: ObjectId(),
  title: "Quiz de Prueba",
  description: "hola k ace",
  creator: player.insertedId,
  createdAt: new Date(),
  started: false,
  questions: []
});

const question = db.questions.insertOne({
  _id: ObjectId(),
  quiz: quiz.insertedId,
  text: "who let the dogs out?",
  time: 60,
  points: 900
});


const answer = db.answers.insertOne({
  _id: ObjectId(),
  question: question.insertedId,
  text: "hola k ace ",
  is_correct: true,
});

const ranking = db.rankings.insertOne({
  _id: ObjectId(),
  session: session.insertedId,
  player: player.insertedId,
  position: 1,
  final_score: 5555,
  date: new Date()
});

const user = db.users.insertOne({
  _id: ObjectId(),
  username: "David",
  email: "david@email.com",
  password: "hashed_password", // siempre hasheado bcrypt o jwk
  role: "admin", // "admin" | "host" | "player"
  createdAt: new Date()
});
