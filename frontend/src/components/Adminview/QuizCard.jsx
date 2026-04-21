import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Pencil, Trash2, Play, Monitor } from "lucide-react";

export default function QuizCard({ quiz, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const questionCount = quiz.questions?.length ?? 0;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (!window.confirm(`¿Borrar "${quiz.title}"?`)) return;
    onDelete(quiz.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    navigate(`/quiz/edit/${quiz.id}`);
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (!quiz.pin) {
      alert("Este quiz no tiene un pin asignado.");
      return;
    }
    navigate(`/host/${quiz.pin}`);
  };

  const isPresentation = quiz.mode === "presentacion";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer">
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        {quiz.image ? (
          <img
            src={quiz.image}
            alt={quiz.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-2xl font-black">
              {quiz.title?.[0]?.toUpperCase() ?? "Q"}
            </span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {questionCount} {questionCount === 1 ? "pregunta" : "preguntas"}
        </div>
        <div
          className={`absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isPresentation
              ? "bg-blue-500/90 text-white"
              : "bg-[#16a34a]/90 text-white"
          }`}
        >
          {isPresentation ? (
            <Monitor size={9} />
          ) : (
            <Play size={9} fill="white" strokeWidth={0} />
          )}
          {isPresentation ? "Presentación" : "Normal"}
        </div>
      </div>
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {quiz.title}
            </p>
            {quiz.pin && (
              <p className="text-xs font-bold text-gray-600 flex-shrink-0">
                PIN: {quiz.pin}
              </p>
            )}
          </div>
          <p className="text-left text-xs text-gray-400 truncate">
            {quiz.creator_username ?? "Tú"}
          </p>
        </div>
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
          >
            <MoreVertical size={15} className="text-gray-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 bottom-8 w-36 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50">
              <button
                onClick={handlePlay}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-green-600 hover:bg-green-50 transition-colors"
              >
                <Play size={13} />
                Jugar
              </button>
              <button
                onClick={handleEdit}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                <Pencil size={13} className="text-gray-400" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
              >
                <Trash2 size={13} />
                Borrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
