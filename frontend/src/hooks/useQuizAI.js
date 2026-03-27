import { useState } from "react";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_QHIT_KEY;
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;
const MODEL = "llama-3.1-8b-instant";
console.log(import.meta.env.VITE_QHIT_KEY);
console.log("KEY:", import.meta.env.VITE_QHIT_KEY);

export const fetchImage = async (query) => {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    );
    const data = await res.json();
    return data.results[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
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
`;

    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Tema: ${prompt}` },
          ],
          temperature: 0.5,
          max_tokens: 1200,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Error al llamar a Groq");
      }

      const data = await res.json();
      const raw = data.choices[0].message.content.trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const mapped = await Promise.all(
        parsed.questions.map(async (q) => ({
          question: q.question,
          image: await fetchImage(q.question),
          answers: q.answers,
          correct: q.correct,
          timeLimit: q.timeLimit || 20,
          answerType: q.answerType || "single",
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