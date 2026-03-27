const API_URL = "http://localhost:8000";

/**
 * @returns {Promise<Question[]>}
 */
export async function getQuestions() {
  const res = await fetch(`${API_URL}/questions/`);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

/**
 * @param {string} id
 * @returns {Promise<Question>}
 */
export async function getQuestion(id) {
  const res = await fetch(`${API_URL}/questions/${id}`);
  if (!res.ok) throw new Error("Question not found");
  return res.json();
}

/**
 * @param {string} questionId
 * @returns {Promise<Answer[]>}
 */
export async function getAnswers(questionId) {
  const res = await fetch(`${API_URL}/answers/?question=${questionId}`);
  if (!res.ok) throw new Error("Failed to fetch answers");
  return res.json();
}

/**
 * @param {string} questionId
 * @param {string} answerId
 * @returns {Promise<Answer>}
 */
export async function getAnswer(questionId, answerId) {
  const res = await fetch(`${API_URL}/answers/${answerId}`);
  if (!res.ok) throw new Error("Answer not found");
  return res.json();
}

/**
 * @param {CreateQuestionPayload} payload
 * @returns {Promise<Question>}
 */
export async function createQuestion(payload) {
  const res = await fetch(`${API_URL}/questions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create question");
  return res.json();
}

/**
 * @param {CreateAnswerPayload} payload
 * @returns {Promise<Answer>}
 */
export async function createAnswer(payload) {
  const res = await fetch(`${API_URL}/answers/`, {
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
 * @returns {Promise<{ id: string, pin: number }>}
 */
export async function createQuiz(payload) {
  const res = await fetch(`${API_URL}/quizzes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      creator: payload.creator,
      image: payload.image ?? null,
      mode: payload.mode ?? "normal",
      scheduled_at: payload.scheduled_at ?? null,
    }),
  });
  if (!res.ok) throw new Error("Failed to create quiz");
  return res.json();
}

/**
 * @param {string} quizId
 * @param {string[]} questionIds
 * @param {{ mode?: string, scheduled_at?: string }} [options]
 * @returns {Promise<void>}
 */
export async function updateQuizQuestions(quizId, questionIds, options = {}) {
  const res = await fetch(`${API_URL}/quizzes/${quizId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questions: questionIds,
      ...options,
    }),
  });
  if (!res.ok) throw new Error("Failed to update quiz questions");
}

/**
 * @param {string} quizId
 * @returns {Promise<Quiz>}
 */
export async function getQuizFull(quizId) {
  const res = await fetch(`${API_URL}/quizzes/full/${quizId}`);
  if (!res.ok) throw new Error("Failed to fetch quiz");
  return res.json();
}

/**
 * @param {string} quizId
 * @returns {Promise<void>}
 */
export async function deleteQuiz(quizId) {
  const res = await fetch(`${API_URL}/quizzes/${quizId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete quiz");
}

/**
 * @param {string} quizId
 * @param {{ mode: string, scheduled_at?: string | null }} payload
 * @returns {Promise<void>}
 */
export async function updateQuizMode(quizId, payload) {
  const res = await fetch(`${API_URL}/quizzes/${quizId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: payload.mode,
      scheduled_at: payload.scheduled_at ?? null,
    }),
  });
  if (!res.ok) throw new Error("Failed to update quiz mode");
}

/**
 * @param {string} pin
 * @returns {Promise<Quiz>}
 */
export async function getQuizByPin(pin) {
  const res = await fetch(`${API_URL}/quizzes/by-pin/${pin}`);
  if (!res.ok) throw new Error("Quiz not found");
  return res.json();
}

/**
 * @param {string} pin
 * @returns {Promise<Quiz>}
 */
export async function getQuizFullByPin(pin) {
  const res = await fetch(`${API_URL}/quizzes/full/by-pin/${pin}`);
  if (!res.ok) throw new Error("Quiz not found");
  return res.json();
}

/**
 * @param {string} creatorId
 * @returns {Promise<Quiz[]>}
 */
export async function getQuizzesByCreator(creatorId) {
  const res = await fetch(`${API_URL}/quizzes/by-creator/${creatorId}`);
  if (!res.ok) throw new Error("Failed to fetch quizzes");
  return res.json();
}

/**
 * @param {string} quizId
 * @param {{ title?: string, image?: string | null }} payload
 * @returns {Promise<void>}
 */
export async function updateQuizInfo(quizId, payload) {
  const res = await fetch(`${API_URL}/quizzes/${quizId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: payload.title,
      image: payload.image ?? null,
    }),
  });
  if (!res.ok) throw new Error("Failed to update quiz info");
}