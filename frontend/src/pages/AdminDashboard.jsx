import { useEffect, useMemo, useState } from "react";
import { Calendar, ClipboardList, Hash, Trash2, PlusCircle, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8000";

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/quizzes/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "No se pudieron cargar los quizzes.");
      }

      setQuizzes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar los quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchQuizzes();
  }, [token]);

  const handleDelete = async (quizId, quizTitle) => {
    const confirmed = window.confirm(
      `¿Eliminar el quiz "${quizTitle}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(quizId);

      const res = await fetch(`${API_URL}/quizzes/${quizId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo eliminar.");
      }

      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const sortedQuizzes = useMemo(() => {
    return [...quizzes].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [quizzes]);

  const totalQuestions = useMemo(() => {
    return quizzes.reduce((acc, quiz) => {
      return acc + (Array.isArray(quiz.questions) ? quiz.questions.length : 0);
    }, 0);
  }, [quizzes]);

  const formatDate = (date) => {
    if (!date) return "Sin fecha";
    const d = new Date(date);
    return Number.isNaN(d.getTime()) ? "Fecha inválida" : d.toLocaleDateString();
  };

  return (
    <div className="bg-[#fff7f2] min-h-screen">
      <Navbar />

      <div className="px-6 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm px-6 py-4 mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              MIS QUIZZES
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Usuario:{" "}
              <span className="font-semibold text-gray-700">
                {user?.username}
              </span>
            </p>

            <div className="flex justify-center mt-4 gap-3 flex-wrap">
              <div className="bg-[#fff7f2] border border-gray-100 rounded-xl px-4 py-2 min-w-[110px]">
                <p className="text-xs text-gray-500">Total quizzes</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {quizzes.length}
                </p>
              </div>

              <div className="bg-[#fff7f2] border border-gray-100 rounded-xl px-4 py-2 min-w-[110px]">
                <p className="text-xs text-gray-500">Preguntas</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {totalQuestions}
                </p>
              </div>

              <button
                onClick={() => navigate("/quiz/create")}
                className="flex items-center gap-2 bg-[#e21b3c] text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
              >
                <PlusCircle size={16} />
                Crear quiz
              </button>
            </div>
          </div>

          {/* STATES */}
          {loading && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-gray-500">
              Cargando quizzes...
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && sortedQuizzes.length === 0 && (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#fff1f4] flex items-center justify-center mb-4">
                <ClipboardList size={24} className="text-[#e21b3c]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Aún no has creado quizzes
              </h2>
              <button
                onClick={() => navigate("/quiz/create")}
                className="inline-flex items-center gap-2 bg-[#e21b3c] text-white px-5 py-3 rounded-2xl text-sm font-medium hover:opacity-90 transition"
              >
                <PlusCircle size={18} />
                Crear mi primer quiz
              </button>
            </div>
          )}

          {/* QUIZZES */}
          {!loading && !error && sortedQuizzes.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {quiz.title || "Sin título"}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Gestiona este quiz
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(quiz._id, quiz.title)}
                      disabled={deletingId === quiz._id}
                      className="flex items-center gap-2 bg-[#e21b3c] text-white px-4 py-2 rounded-2xl hover:opacity-90 disabled:opacity-50 transition"
                    >
                      <Trash2 size={16} />
                      {deletingId === quiz._id ? "..." : "Eliminar"}
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-[#fff7f2] border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Hash size={15} />
                        <span className="text-xs">Código</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {quiz.pin ?? "N/A"}
                      </p>
                    </div>

                    <div className="bg-[#fff7f2] border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <ClipboardList size={15} />
                        <span className="text-xs">Preguntas</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {quiz.questions?.length || 0}
                      </p>
                    </div>

                    <div className="bg-[#fff7f2] border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Calendar size={15} />
                        <span className="text-xs">Fecha</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(quiz.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}