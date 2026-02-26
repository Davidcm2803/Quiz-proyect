const API_URL = "http://localhost:8000";

/**
 * @returns {Promise<Question[]>}
 */
export async function getQuestions() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

/**
 * @param {string} id
 * @returns {Promise<Question>}
 */
export async function getQuestion(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Question not found");
  return res.json();
}

/**
 * @param {string} questionId
 * @returns {Promise<Answer[]>}
 */
export async function getAnswers(questionId) {
  const res = await fetch(`${API_URL}/${questionId}/answers`);
  if (!res.ok) throw new Error("Failed to fetch answers");
  return res.json();
}

/**
 * @param {string} questionId
 * @param {string} answerId
 * @returns {Promise<Answer>}
 */
export async function getAnswer(questionId, answerId) {
  const res = await fetch(`${API_URL}/${questionId}/answers/${answerId}`);
  if (!res.ok) throw new Error("Answer not found");
  return res.json();
}

/**
 * @param {CreateQuestionPayload} payload
 * @returns {Promise<Question>}
 */
export async function createQuestion(payload) {
  const res = await fetch(`${API_URL}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quiz: payload.quiz,
      text: payload.text,
      points: payload.points,
      time: payload.time,
    }),
  });

  if (!res.ok) throw new Error("Failed to create question");
  return res.json();
}

/**
 * @param {CreateAnswerPayload} payload
 * @returns {Promise<Answer>}
 */
export async function createAnswer(payload) {
  const res = await fetch(`${API_URL}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: payload.questionId,
      text: payload.text,
      is_correct: payload.is_correct,
    }),
  });

  if (!res.ok) throw new Error("Failed to create answer");
  return res.json();
}

/**
 * @param {CreateQuizPayload} payload
 * @returns {Promise<{ id: string }>}
 */
export async function createQuiz(payload) {
  const res = await fetch(`${API_URL}/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      started: false,
      createdAt: new Date().toISOString(),
      questions: [],
    }),
  });

  if (!res.ok) throw new Error("Failed to create quiz");
  return res.json();
}

/**
 * @param {string} quizId
 * @param {string[]} questionIds
 * @returns {Promise<void>}
 */
export async function updateQuizQuestions(quizId, questionIds) {
  const res = await fetch(`${API_URL}/quizzes/${quizId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questions: questionIds,
    }),
  });

  if (!res.ok) throw new Error("Failed to update quiz questions");
}