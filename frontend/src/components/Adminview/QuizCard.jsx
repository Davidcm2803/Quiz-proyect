import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Pencil, Trash2, Play } from "lucide-react";

export default function QuizCard({ quiz, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const questionCount = quiz?.questions?.length ?? 0;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!quiz) return null;

  const handleMenuToggle = (e) => {
  e.stopPropagation();
  const rect = e.currentTarget.getBoundingClientRect();
  setMenuPos({
    top: rect.bottom + 6,
    left: rect.right - 160,
  });
  setMenuOpen((o) => !o);
};

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

  return (
    <>
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
            className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"
            onClick={() => navigate(`/quiz/edit/${quiz.id}`)}
          />
        </div>
        <div className="px-3 py-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800 truncate">{quiz.title}</p>
            <p className="text-left text-xs text-gray-400 truncate">{quiz.creator_username ?? "Tú"}</p>
          </div>
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={handleMenuToggle}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}
          />
          <div
            className="fixed z-50 w-40 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <button
              onClick={handlePlay}
              className="w-full flex items-center gap-2.5 px-3 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors"
            >
              <Play size={14} />
              Jugar
            </button>
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-2.5 px-3 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
            >
              <Pencil size={14} className="text-gray-400" />
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2.5 px-3 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
            >
              <Trash2 size={14} />
              Borrar
            </button>
          </div>
        </>
      )}
    </>
  );
}