import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

export default function PresentCard({ quiz }) {
  const navigate = useNavigate();
  const questionCount = quiz.questions?.length ?? 0;

  const handlePresent = () => {
    if (!quiz.pin) {
      alert("Este quiz no tiene un pin asignado.");
      return;
    }
    navigate(`/host/${quiz.pin}`);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer">
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {quiz.image ? (
          <img
            src={quiz.image}
            alt={quiz.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-3xl font-black">
              {quiz.title?.[0]?.toUpperCase() ?? "Q"}
            </span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {questionCount} {questionCount === 1 ? "pregunta" : "preguntas"}
        </div>
      </div>
      <div className="px-3 pt-3 pb-3 flex flex-col gap-2.5">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate leading-tight">
            {quiz.title}
          </p>
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {quiz.creator_username ?? "Tú"}
          </p>
        </div>

        <button
          onClick={handlePresent}
          className="w-full bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md"
        >
          <Play size={11} fill="white" strokeWidth={0} />
          Presentar
        </button>
      </div>
    </div>
  );
}