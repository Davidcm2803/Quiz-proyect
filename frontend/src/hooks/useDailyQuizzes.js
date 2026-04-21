import { useState, useEffect } from "react";
import config from "../config";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = config.GROQ_KEY;
const MODEL = "llama-3.1-8b-instant";

export const CATEGORIES = [
  "science",
  "mathematics",
  "history",
  "languages",
  "technology",
  "art-and-design",
];

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

const searchPixabay = async (query) => {
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=55524294-5b653e1325aef52868b460bcc&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=3&safesearch=true`
    );
    const data = await res.json();
    return data.hits?.[0]?.previewURL ?? null;
  } catch {
    return null;
  }
};

const fetchWikipediaImage = async (query) => {
  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=1`,
    );
    const searchData = await searchRes.json();
    const title = searchData?.query?.search?.[0]?.title;
    if (!title) return null;

    const imgRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&origin=*&pithumbsize=600`,
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

    const byKeywords = await searchPixabay(query);
    if (byKeywords) return byKeywords;

    const byQuestion = await searchPixabay(question);
    if (byQuestion) return byQuestion;

    const wikiByKeywords = await fetchWikipediaImage(query);
    if (wikiByKeywords) return wikiByKeywords;

    const wikiByQuestion = await fetchWikipediaImage(question);
    if (wikiByQuestion) return wikiByQuestion;

    return null;
  } catch {
    return null;
  }
};

const SYSTEM_PROMPT = `Eres un generador de quizzes educativos.
Responde UNICAMENTE con JSON valido, sin texto adicional, sin bloques de codigo.
Formato exacto:
{"title":"titulo","questions":[{"question":"pregunta","answerType":"single","timeLimit":40,"answers":["A","B","C","D"],"correct":0}]}
Reglas:
- Genera exactamente 8 preguntas sobre un subtema especifico dentro de la categoria (NO uses el nombre de la categoria como titulo)
- El campo "title" debe ser el subtema concreto que elegiste, por ejemplo: "El cuerpo humano", "Algebra lineal", "La Segunda Guerra Mundial", "Verbos irregulares en ingles", "Inteligencia artificial", "El Renacimiento italiano"
- correct es el indice 0-3 de la respuesta correcta
- Respuestas cortas maximo 5 palabras
- Varia timeLimit entre 20, 30 y 40
- JSON completo y cerrado`;

const extractJSON = (raw) => {
  let clean = raw.replace(/```json|```/gi, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found");
  return JSON.parse(clean.slice(start, end + 1));
};

export const generateQuizForCategory = async (slug) => {
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
        {
          role: "user",
          content: `Elige un subtema especifico y creativo dentro de "${label}" y genera el quiz sobre ese subtema.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1200,
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const raw = data.choices[0].message.content.trim();
  const parsed = extractJSON(raw);

  const questionsWithImages = await Promise.all(
    (parsed.questions ?? []).map(async (q) => ({
      ...q,
      image: await fetchImage(q.question),
    }))
  );

  return { ...parsed, questions: questionsWithImages };
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);
const getCacheKey = (slug) => `quiz_${slug}_${getTodayKey()}`;

export const getCachedQuiz = (slug) => {
  try {
    const raw = localStorage.getItem(getCacheKey(slug));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCachedQuiz = (slug, quiz) => {
  try {
    localStorage.setItem(getCacheKey(slug), JSON.stringify(quiz));
  } catch {}
};

export const clearCachedQuiz = (slug) => {
  localStorage.removeItem(getCacheKey(slug));
};

export function useDailyQuiz(slug) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async (force = false) => {
    setLoading(true);
    setError(false);

    if (force) clearCachedQuiz(slug);

    const cached = getCachedQuiz(slug);
    if (cached) {
      setQuiz(cached);
      setLoading(false);
      return;
    }

    try {
      const fresh = await generateQuizForCategory(slug);
      setCachedQuiz(slug, fresh);
      setQuiz(fresh);
    } catch {
      setError(true);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    load();
  }, [slug]);

  const regenerate = () => load(true);

  return { quiz, loading, error, regenerate };
}

export function useCarouselQuizzes() {
  const [quizzes, setQuizzes] = useState({});

  useEffect(() => {
    const result = {};
    for (const slug of CATEGORIES) {
      result[slug] = getCachedQuiz(slug);
    }
    setQuizzes(result);
  }, []);

  return { quizzes };
}