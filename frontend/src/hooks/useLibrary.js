import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteQuiz as deleteQuizApi } from "../database/database.js";

const API = "http://localhost:8000";

export function useLibrary() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`${API}/quizzes/by-creator/${user.id}`)
      .then((r) => r.json())
      .then(setQuizzes)
      .catch(() => setError("No se pudieron cargar los quizzes"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const deleteQuiz = useCallback(async (quizId) => {
    await deleteQuizApi(quizId);
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  }, []);

  return { quizzes, loading, error, deleteQuiz };
}