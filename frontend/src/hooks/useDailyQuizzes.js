import { useState, useEffect } from "react";
import config from "../config";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = config.GROQ_KEY;
const MODEL = "llama-3.1-8b-instant";

const CATEGORIES = ["science", "mathematics", "history", "languages", "technology", "art-and-design"];

const SYSTEM_PROMPT = `Eres un generador de quizzes educativos.
Responde UNICAMENTE con JSON valido, sin texto adicional, sin bloques de codigo.
Formato exacto:
{"title":"titulo","questions":[{"question":"pregunta","answerType":"single","timeLimit":40,"answers":["A","B","C","D"],"correct":0}]}
Reglas:
- Genera exactamente 8 preguntas
- correct es el indice 0-3 de la respuesta correcta
- Respuestas cortas maximo 5 palabras
- Varia timeLimit entre  20, 30 y 40
- JSON completo y cerrado`;

const extractJSON = (raw) => {
  let clean = raw.replace(/```json|```/gi, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found");
  return JSON.parse(clean.slice(start, end + 1));
};

const generateQuizForCategory = async (slug) => {
  const label = slug.replace(/-/g, " ").replace(/\band\b/g, "&");
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Quiz: ${label}` },
      ],
      temperature: 0.5,
      max_tokens: 1200,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const raw = data.choices[0].message.content.trim();
  return extractJSON(raw);
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const loadOrGenerateDailyQuizzes = async (forceSlug = null) => {
  const todayKey = getTodayKey();
  const cached = localStorage.getItem("daily_quizzes");

  if (cached) {
    const parsed = JSON.parse(cached);
    if (parsed.date === todayKey) {
      if (forceSlug && parsed.quizzes[forceSlug] === null) {
        try {
          parsed.quizzes[forceSlug] = await generateQuizForCategory(forceSlug);
          localStorage.setItem("daily_quizzes", JSON.stringify({ date: todayKey, quizzes: parsed.quizzes }));
        } catch {
          parsed.quizzes[forceSlug] = null;
        }
      }
      return parsed.quizzes;
    }
  }

  const quizzes = {};
  for (const slug of CATEGORIES) {
    try {
      quizzes[slug] = await generateQuizForCategory(slug);
      await delay(1200);
    } catch {
      quizzes[slug] = null;
    }
  }

  localStorage.setItem("daily_quizzes", JSON.stringify({ date: todayKey, quizzes }));
  return quizzes;
};

export const getDailyQuiz = (slug) => {
  try {
    const cached = localStorage.getItem("daily_quizzes");
    if (!cached) return null;
    const { quizzes } = JSON.parse(cached);
    return quizzes?.[slug] ?? null;
  } catch {
    return null;
  }
};

export function useDailyQuiz(slug) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      setLoading(true);
      setError(false);

      const cached = getDailyQuiz(slug);
      if (cached) {
        setQuiz(cached);
        setLoading(false);
        return;
      }

      try {
        const all = await loadOrGenerateDailyQuizzes(slug);
        setQuiz(all[slug] ?? null);
      } catch {
        setError(true);
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  return { quiz, loading, error };
}