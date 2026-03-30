import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteQuiz as deleteQuizApi } from "../database/database.js";

const API = "http://localhost:8000";

export function useLibrary(mode = null) {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    const url = mode
      ? `${API}/quizzes/by-creator/${user.id}?mode=${mode}`
      : `${API}/quizzes/by-creator/${user.id}`;
    fetch(url)
      .then((r) => r.json())
      .then(setQuizzes)
      .catch(() => setError("No se pudieron cargar los quizzes"))
      .finally(() => setLoading(false));
  }, [user?.id, mode]);

  const deleteQuiz = useCallback(async (quizId) => {
    await deleteQuizApi(quizId);
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  }, []);

  return { quizzes, loading, error, deleteQuiz };
}