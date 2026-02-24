import { Question } from "../types/question";
import { Answer } from "../types/answer";

const API_URL = "http://localhost:8000";

export async function getQuestions(): Promise<Question[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export async function getQuestion(id: string): Promise<Question> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Question not found");
  return res.json();
}

export async function getAnswers(questionId: string): Promise<Answer[]> {
  const res = await fetch(`${API_URL}/${questionId}/answers`);
  if (!res.ok) throw new Error("Failed to fetch answers");
  return res.json();
}

export async function getAnswer(questionId: string, answerId: string): Promise<Answer> {
  const res = await fetch(`${API_URL}/${questionId}/answers/${answerId}`);
  if (!res.ok) throw new Error("Answer not found");
  return res.json();
}

export type CreateQuestionPayload = {
  quiz: string;
  text: string;
  points: number;
  time: number;
};

export type CreateAnswerPayload = {
  questionId: string;
  text: string;
  is_correct: boolean;
};

export async function createQuestion(payload: CreateQuestionPayload) {
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

export async function createAnswer(payload: CreateAnswerPayload) {
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

export type CreateQuizPayload = {
  title: string;
  description: string;
  creator: string;
};

export async function createQuiz(
  payload: CreateQuizPayload
): Promise<{ id: string }> {
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

export async function updateQuizQuestions(
  quizId: string,
  questionIds: string[]
): Promise<void> {
  const res = await fetch(`${API_URL}/quizzes/${quizId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questions: questionIds,
    }),
  });

  if (!res.ok) throw new Error("Failed to update quiz questions");
}


