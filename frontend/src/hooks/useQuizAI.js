import { useState } from "react";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_QHIT_KEY;
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;
const MODEL = "llama-3.1-8b-instant";

const simplifyImageQuery = async (question) => {
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "Extract 1-3 key visual nouns in English from the question for an image search. Reply with only the keywords, no punctuation, no explanation.",
          },
          { role: "user", content: question },
        ],
        temperature: 0,
        max_tokens: 20,
      }),
    });
    const data = await res.json();
    return data.choices[0].message.content.trim();
  } catch {
    return question;
  }
};

const fetchWikipediaImage = async (query) => {
  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=1`
    );
    const searchData = await searchRes.json();
    const title = searchData?.query?.search?.[0]?.title;
    if (!title) return null;

    const imgRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&origin=*&pithumbsize=600`
    );
    const imgData = await imgRes.json();
    const pages = imgData?.query?.pages;
    const page = pages?.[Object.keys(pages)[0]];
    return page?.thumbnail?.source ?? null;
  } catch {
    return null;
  }
};

export const fetchImage = async (question) => {
  try {
    const query = await simplifyImageQuery(question);

    const unsplashRes = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    );
    const unsplashData = await unsplashRes.json();
    const unsplashUrl = unsplashData.results?.[0]?.urls?.regular ?? null;
    if (unsplashUrl) return unsplashUrl;

    return await fetchWikipediaImage(query);
  } catch {
    return null;
  }
};

const extractJSON = (raw) => {
  let clean = raw.replace(/```json|```/gi, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in response");
  }
  clean = clean.slice(start, end + 1);

  try {
    return JSON.parse(clean);
  } catch (_) {
    const lastCompleteQuestion = clean.lastIndexOf("},\n    {");
    if (lastCompleteQuestion !== -1) {
      const truncated = clean.slice(0, lastCompleteQuestion + 1) + "\n  ]\n}";
      return JSON.parse(truncated);
    }
    throw new Error("Could not recover valid JSON from response");
  }
};

const validateQuiz = (parsed) => {
  if (!parsed || typeof parsed !== "object") throw new Error("Response is not an object");
  if (typeof parsed.title !== "string" || !parsed.title.trim()) throw new Error("Missing title");
  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) throw new Error("No questions array");

  return parsed.questions
    .filter((q) => (
      typeof q.question === "string" &&
      Array.isArray(q.answers) &&
      q.answers.length >= 2 &&
      (typeof q.correct === "number" || Array.isArray(q.correct))
    ))
    .map((q) => ({
      question: q.question,
      answers: q.answers,
      correct: q.correct,
      timeLimit: [15, 20, 30].includes(q.timeLimit) ? q.timeLimit : 20,
      answerType: q.answerType === "multiple" ? "multiple" : "single",
    }));
};

export function useQuizAI({ setTitle, setQuestions, setActiveIndex }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const generateQuiz = async (prompt) => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError("");

    const systemPrompt = `
Eres un generador de quizzes educativos. El usuario te dará un tema y debes generar un quiz.
Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin bloques de código, sin explicaciones.
El formato debe ser exactamente este:
{
  "title": "título del quiz",
  "questions": [
    {
      "question": "texto de la pregunta",
      "answerType": "single",
      "timeLimit": 20,
      "answers": ["opción A", "opción B", "opción C", "opción D"],
      "correct": 0
    }
  ]
}
Reglas:
- Genera entre 4 y 6 preguntas
- "correct" es el índice (0-3) de la respuesta correcta
- "answerType" puede ser "single" o "multiple"
- Si es "multiple", "correct" es un array de índices: [0, 2]
- Las respuestas deben ser cortas (máximo 6 palabras)
- Varía los tiempos entre 15, 20 y 30 segundos
- Responde siempre en el mismo idioma del tema
- IMPORTANTE: asegúrate de que el JSON esté completo y cerrado correctamente
`;

    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Tema: ${prompt}` },
          ],
          temperature: 0.5,
          max_tokens: 2048,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Error al llamar a Groq");
      }

      const data = await res.json();
      const raw = data.choices[0].message.content.trim();
      const parsed = extractJSON(raw);
      const validQuestions = validateQuiz(parsed);

      if (validQuestions.length === 0) {
        throw new Error("No se generaron preguntas válidas");
      }

      const mapped = await Promise.all(
        validQuestions.map(async (q) => ({
          ...q,
          image: await fetchImage(q.question),
        }))
      );

      setTitle(parsed.title);
      setQuestions(mapped);
      setActiveIndex(0);
      return true;
    } catch (e) {
      console.error("Error generando quiz:", e);
      setError("No se pudo generar el quiz. Intenta de nuevo.");
      return false;
    } finally {
      setGenerating(false);
    }
  };

  return { generateQuiz, generating, error };
}