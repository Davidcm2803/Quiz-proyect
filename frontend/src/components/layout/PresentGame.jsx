import { useNavigate } from "react-router-dom";
import { Play, LogIn } from "lucide-react";
import Navbar from "./Navbar";
import PresentCard from "./PresentCard";
import { useLibrary } from "../../hooks/useLibrary";
import { useAuth } from "../../context/AuthContext";

export default function PresentGame() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { quizzes, loading } = useLibrary("presentacion");

  if (!user) {
    return (
      <div className="bg-[#F8FBF3] min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-5">
          <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center">
            <LogIn size={28} className="text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-gray-800 font-black text-xl mb-2">¡Ups!</p>
            <p className="text-gray-500 font-semibold text-sm mb-1">
              Para presentar necesitas iniciar sesión
            </p>
            <p className="text-gray-400 text-xs max-w-xs">
              Accede a tu cuenta para ver tus quizzes disponibles.
            </p>
          </div>
          <button
            onClick={() => navigate("/signup")}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-bold px-8 py-3 rounded-2xl transition-all active:scale-95"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FBF3] min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-[#16a34a] rounded-2xl flex items-center justify-center">
              <Play size={20} fill="white" strokeWidth={0} />
            </div>
            <h1 className="text-2xl font-black text-[#1a1a1a]">Presentar quiz</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Selecciona el quiz que quieres presentar
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-7 h-7 border-2 border-[#16a34a]/30 border-t-[#16a34a] rounded-full animate-spin" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <p className="text-gray-400 text-sm">No tienes quizzes en modo presentación</p>
            <button
              onClick={() => navigate("/")}
              className="text-[#16a34a] text-sm font-semibold hover:underline"
            >
              Crear uno nuevo →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
            {quizzes.map((quiz) => (
              <PresentCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}