import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createQuestion, createAnswer, createQuiz, updateQuizQuestions, getQuizFull } from "../database/database.js";

const API_URL = "http://localhost:8000";

const emptyQuestion = () => ({
  question: "",
  image: null,
  answers: ["", "", "", ""],
  correct: null,
  timeLimit: 20,
  answerType: "single",
});

const mapQuestion = (q) => ({
  id: q.id,
  question: q.text,
  image: q.image ?? null,
  answers: q.answers.map((a) => a.text),
  correct: (() => {
    const correct = q.answers
      .map((a, i) => (a.is_correct ? i : null))
      .filter((i) => i !== null);
    return correct.length === 1 ? correct[0] : correct;
  })(),
  timeLimit: q.time ?? 20,
  answerType: q.answerType ?? "single",
});

export function useQuizCreate(quizId = null) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("Quiz title");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!quizId);
  const [quizPin, setQuizPin] = useState(null);

  const isEditing = !!quizId;

  useEffect(() => {
    if (!quizId) return;
    getQuizFull(quizId)
      .then((data) => {
        setTitle(data.title);
        setQuestions(data.questions.map(mapQuestion));
        setQuizPin(data.pin);
      })
      .catch(() => alert("Error cargando el quiz"))
      .finally(() => setLoading(false));
  }, [quizId]);

  const active = questions[activeIndex] ?? null;

  const updateActive = (field, value) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === activeIndex ? { ...q, [field]: value } : q))
    );

  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion()]);
    setActiveIndex(questions.length);
  };

  const deleteQuestion = (index) => {
    if (questions.length <= 1) return;
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    setActiveIndex(Math.min(activeIndex, updated.length - 1));
  };

  const validate = () => {
    if (!title.trim() || title.trim() === "Quiz title") {
      alert("El quiz debe tener un título."); return false;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`La pregunta ${i + 1} no tiene texto.`); setActiveIndex(i); return false;
      }
      for (let j = 0; j < q.answers.length; j++) {
        if (!q.answers[j].trim()) {
          alert(`La pregunta ${i + 1} tiene respuestas vacías.`); setActiveIndex(i); return false;
        }
      }
    }
    return true;
  };

  const saveQuiz = async () => {
    if (!validate()) return;
    if (!window.confirm(isEditing ? "¿Guardar cambios?" : "¿Deseas guardar este quiz?")) return;

    setSaving(true);
    try {
      let quizIdToUse = quizId;

      if (isEditing) {
        await fetch(`${API_URL}/quizzes/${quizId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            image: questions[0]?.image ?? null,
          }),
        });

        await fetch(`${API_URL}/questions/by-quiz/${quizId}`, {
          method: "DELETE",
        });
      } else {
        const { id, pin: newPin } = await createQuiz({
          title: title.trim(),
          description: "",
          creator: user.id,
          image: questions[0]?.image ?? null,
        });
        quizIdToUse = id;
        window._savedPin = newPin;
      }

      const questionIds = [];
      for (const q of questions) {
        const { id: questionId } = await createQuestion({
          quiz: quizIdToUse,
          text: q.question,
          image: q.image ?? null,
          points: 900,
          time: q.timeLimit,
          answerType: q.answerType,
        });
        questionIds.push(questionId);
        for (let i = 0; i < q.answers.length; i++) {
          await createAnswer({
            questionId,
            text: q.answers[i],
            is_correct: Boolean(
              Array.isArray(q.correct) ? q.correct.includes(i) : q.correct === i
            ),
          });
        }
      }

      await updateQuizQuestions(quizIdToUse, questionIds);

      if (isEditing) {
        const goHost = window.confirm(
          `Quiz actualizado! Código de sala: ${quizPin}\n\n¿Iniciar el quiz ahora como host?`
        );
        navigate(goHost ? `/host/${quizPin}` : "/admin/library");
      } else {
        const pin = window._savedPin;
        delete window._savedPin;
        const goHost = window.confirm(`Quiz guardado! Código de sala: ${pin}\n\n¿Iniciar el quiz ahora como host?`);
        navigate(goHost ? `/host/${pin}` : "/");
      }

    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Error al guardar. Verifica que el servidor esté corriendo.");
    } finally {
      setSaving(false);
    }
  };

  return {
    title, setTitle,
    questions, setQuestions,
    active, activeIndex, setActiveIndex,
    saving, loading, isEditing,
    quizPin,
    updateActive, addQuestion, deleteQuestion, saveQuiz,
  };
}