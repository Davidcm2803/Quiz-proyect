import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { fetchImage } from "./useQuizAI";
import config from "../config";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = config.GROQ_KEY;
const MODEL = "llama-3.1-8b-instant";

export default function usePDFQuiz({ setTitle, setQuestions, setActiveIndex }) {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  async function extractTextFromPDF(file) {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((i) => i.str).join(" ") + "\n";
    }
    return text;
  }

  function cleanJSON(text) {
    let clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) throw new Error("No JSON found");
    return clean.slice(start, end + 1);
  }

  async function importFromPDF(file) {
    try {
      if (!file || file.type !== "application/pdf") {
        setError("Archivo inválido. Debe ser un PDF.");
        return null;
      }

      setImporting(true);
      setError("");

      const text = await extractTextFromPDF(file);

      if (!text || text.length < 10) {
        setError("No se pudo leer el contenido del PDF");
        return null;
      }

      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: `
Convierte el siguiente texto en un quiz.

Reglas:
- Detecta preguntas y respuestas sin importar formato
- Identifica la correcta usando: *, ✓, letras (a,b,c), negrita
- Máximo 6 palabras por respuesta
- Mantener idioma original
- timeLimit: 15, 20 o 30
- answerType: "single" o "multiple"
- IMPORTANTE: devuelve el JSON completo y cerrado correctamente

Devuelve SOLO JSON válido sin texto extra:

{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "answerType": "single",
      "timeLimit": 20,
      "answers": ["A", "B", "C", "D"],
      "correct": 0
    }
  ]
}`,
            },
            { role: "user", content: text },
          ],
        }),
      });

      if (!res.ok) {
        setError("Error al procesar el PDF con IA");
        return null;
      }

      const data = await res.json();

      if (!data.choices?.[0]) {
        setError("Respuesta inválida de la IA");
        return null;
      }

      const raw = data.choices[0].message.content;
      const parsed = JSON.parse(cleanJSON(raw));

      if (!parsed || !Array.isArray(parsed.questions)) {
        setError("Formato inválido del quiz generado");
        return null;
      }

      const formatted = await Promise.all(
        parsed.questions
          .filter((q) =>
            typeof q.question === "string" &&
            Array.isArray(q.answers) &&
            q.answers.length >= 2 &&
            (typeof q.correct === "number" || Array.isArray(q.correct))
          )
          .map(async (q) => ({
            question: q.question || "",
            image: await fetchImage(q.question || ""),
            answers: q.answers || ["", "", "", ""],
            correct: Array.isArray(q.correct) ? q.correct : q.correct ?? 0,
            timeLimit: [15, 20, 30].includes(q.timeLimit) ? q.timeLimit : 20,
            answerType: q.answerType === "multiple" ? "multiple" : "single",
          }))
      );

      if (formatted.length === 0) {
        setError("No se generaron preguntas");
        return null;
      }

      const result = {
        title: parsed.title || "Quiz PDF",
        questions: formatted,
      };

      setTitle(result.title);
      setQuestions(result.questions);
      setActiveIndex(0);
      return result;
    } catch (e) {
      console.error(e);
      setError("Error procesando el PDF");
      return null;
    } finally {
      setImporting(false);
    }
  }

  return { importFromPDF, importing, error };
}