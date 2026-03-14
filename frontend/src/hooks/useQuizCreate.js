import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion, createAnswer, createQuiz, updateQuizQuestions } from "../database/database.js";

const emptyQuestion = () => ({
  question: "",
  image: null,
  answers: ["", "", "", ""],
  correct: null,
  timeLimit: 20,
  answerType: "single",
});

export function useQuizCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Quiz title");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const active = questions[activeIndex];

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
    if (!window.confirm("¿Deseas guardar este quiz?")) return;

    setSaving(true);
    try {
      const { id: quizId, pin } = await createQuiz({
        title: title.trim(),
        description: "",
        creator: "6993cc6bc3012d94d9284d0d",
      });

      const questionIds = [];
      for (const q of questions) {
        const { id: questionId } = await createQuestion({
          quiz: quizId,
          text: q.question,
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

      await updateQuizQuestions(quizId, questionIds);

      const goHost = window.confirm(`Quiz guardado! Código de sala: ${pin}\n\n¿Iniciar el quiz ahora como host?`);
      navigate(goHost ? `/host/${pin}` : "/");

    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Error al guardar el quiz. Verifica que el servidor esté corriendo.");
    } finally {
      setSaving(false);
    }
  };

  return { title, setTitle, questions, active, activeIndex, setActiveIndex, saving, updateActive, addQuestion, deleteQuestion, saveQuiz };
}