import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNormalQuiz } from "../../hooks/useNormalQuiz";
import FloatingDecorations from "../ui/FloatingDecorations";
import quizsong from "../../assets/quizsong.mp3";
import config from "../../config";

// config disponible para hooks o extensiones futuras
const { API_URL, WS_URL } = config;

const COLORS = ["bg-[#e21b3c]", "bg-[#1368ce]", "bg-[#d89e00]", "bg-[#26890c]"];
const ICONS = ["▲", "◆", "●", "■"];

function formatCountdown(ms) {
  if (ms === null || ms === undefined) return "";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export default function StudentGameMenu() {
  const { roomId, playerId } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [ready, setReady] = useState(false);

  const {
    phase,
    quiz,
    question,
    questionIndex,
    countdown,
    selected,
    result,
    totalScore,
    timeLeft,
    finalPosition,
    submitAnswer,
  } = useNormalQuiz(roomId, playerId, ready);

  useEffect(() => {
    const audio = new Audio(quizsong);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (["waiting", "question"].includes(phase)) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [phase]);

  if (!ready) return (
    <div className="min-h-screen bg-[#F8FBF3] flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-20 h-20 bg-[#16a34a] rounded-3xl flex items-center justify-center shadow-lg">
        <span className="text-4xl">🎯</span>
      </div>
      <div className="text-center">
        <h2 className="text-[#292726] text-3xl font-black mb-1">¡Listo para jugar?</h2>
        <p className="text-[#292726]/50 text-sm">
          Únete como <span className="font-bold text-[#292726]">{playerId}</span>
        </p>
      </div>
      <button
        onClick={() => setReady(true)}
        className="bg-[#16a34a] text-white font-black text-xl px-12 py-4 rounded-2xl shadow-lg active:scale-95 transition-all hover:bg-[#15803d]"
      >
        ¡Estoy listo! 🚀
      </button>
    </div>
  );

  if (phase === "loading") return (
    <div className="min-h-screen bg-[#F8FBF3] flex items-center justify-center">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-3 h-3 bg-[#16a34a] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );

  if (phase === "error") return (
    <div className="min-h-screen bg-[#F8FBF3] flex flex-col items-center justify-center gap-4">
      <p className="text-2xl font-black text-[#e21b3c]">Quiz no encontrado</p>
      <button onClick={() => navigate("/join")}
        className="bg-[#1a1a2e] text-white font-bold px-8 py-3 rounded-2xl">
        Volver
      </button>
    </div>
  );

  if (phase === "waiting") return (
    <div className="min-h-screen bg-[#F8FBF3] flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-20 h-20 bg-[#16a34a] rounded-3xl flex items-center justify-center shadow-lg">
        <span className="text-4xl">🎯</span>
      </div>
      <div className="text-center">
        <h2 className="text-[#292726] text-3xl font-black mb-1">¡Hola, {playerId}!</h2>
        <p className="text-[#292726]/50 text-sm">{quiz?.title}</p>
      </div>
      <div className="bg-[#1a1a2e] text-white px-8 py-5 rounded-2xl text-center">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">
          Empieza en
        </p>
        <p className="text-4xl font-black font-mono">{formatCountdown(timeLeft)}</p>
      </div>
      <p className="text-[#292726]/30 text-xs text-center max-w-xs">
        El quiz comenzará automáticamente cuando llegue la hora.
      </p>
    </div>
  );

  if (phase === "question" && question) {
    const hasImage = !!question.image;
    const isMultiple = question.answerType === "multiple";
    const total = quiz?.questions?.length ?? 1;
    const selectedArr = Array.isArray(selected) ? selected : [];

    return (
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col relative overflow-hidden">
        <FloatingDecorations />
        <div className="h-2 bg-white/10 relative z-10">
          <div className="h-full bg-[#e21b3c] transition-all duration-1000"
            style={{ width: `${(countdown / (question.time || 20)) * 100}%` }} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-between px-4 py-5 gap-4 relative z-10">
          <div className="w-full flex justify-between items-center max-w-5xl">
            <span className="text-[#a0a0b0] text-sm font-semibold">
              {questionIndex + 1} / {total}
            </span>
            <span className={`text-4xl font-black tabular-nums ${countdown <= 5 ? "text-[#e21b3c] animate-pulse" : "text-white"}`}>
              {countdown}s
            </span>
            <span className="text-[#a0a0b0] text-sm font-semibold">
              {totalScore} pts
            </span>
          </div>
          {isMultiple && (
            <span className="bg-white/10 text-white/50 text-xs font-semibold px-3 py-1 rounded-full">
              Selección múltiple
            </span>
          )}
          <h2 className="text-white font-bold text-center text-2xl sm:text-4xl w-full max-w-5xl">
            {question.text}
          </h2>
          {hasImage && (
            <img
              src={question.image}
              alt=""
              className="w-full max-w-5xl h-80 sm:h-100 object-cover rounded-2xl"
            />
          )}
          <div className="w-full max-w-5xl grid grid-cols-2 gap-4 sm:gap-5">
            {question.answers.map((ans, i) => {
              const isSelected = isMultiple ? selectedArr.includes(i) : selected === i;
              const isDisabled = !isMultiple && selected !== null;
              return (
                <button
                  key={i}
                  onClick={() => submitAnswer(i)}
                  disabled={isDisabled}
                  className={`
                    ${COLORS[i]} rounded-2xl flex items-center justify-center gap-4
                    text-white font-black shadow-xl
                    h-24 sm:h-32 px-6
                    transition-all active:scale-95
                    disabled:opacity-30 disabled:cursor-not-allowed
                    ${isSelected ? "ring-4 ring-white brightness-110" : ""}
                  `}
                >
                  <span className="text-4xl sm:text-5xl shrink-0">{ICONS[i]}</span>
                  <span className="text-lg sm:text-xl leading-tight text-center">
                    {typeof ans === "object" ? ans.text : ans}
                  </span>
                </button>
              );
            })}
          </div>
          {isMultiple && selectedArr.length > 0 && (
            <button
              onClick={() => submitAnswer("confirm")}
              className="w-full max-w-5xl bg-white text-[#1a1a2e] font-black text-lg py-4 rounded-2xl active:scale-95 transition-all"
            >
              Confirmar ({selectedArr.length} seleccionadas)
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "showAnswer") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-5 px-4">
      <div className="text-8xl">
        {result?.correct ? "✅" : result?.partial ? "🟡" : "❌"}
      </div>
      <h2 className={`text-4xl font-black ${result?.correct ? "text-green-400" : result?.partial ? "text-yellow-400" : "text-[#e21b3c]"}`}>
        {result?.correct ? "¡Correcto!" : result?.partial ? "¡Parcial!" : "Incorrecto"}
      </h2>
      {result?.points > 0 && (
        <p className="text-white text-2xl font-bold">+{result.points} pts</p>
      )}
      <p className="text-white/30 text-sm mt-2">Cargando siguiente pregunta...</p>
    </div>
  );

  if (phase === "finished") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-6xl">🏁</div>
      <h2 className="text-white text-4xl font-black">¡Quiz finalizado!</h2>
      <div className="bg-white/10 rounded-3xl px-10 py-6 text-center">
        <p className="text-white/50 text-sm uppercase tracking-widest mb-1">Tu puntaje</p>
        <p className="text-white text-5xl font-black">{totalScore}</p>
        {finalPosition && (
          <p className="text-white/50 text-sm mt-2">Posición #{finalPosition}</p>
        )}
      </div>
      <button
        onClick={() => navigate("/join")}
        className="bg-white text-[#1a1a2e] font-bold px-8 py-4 rounded-2xl active:scale-95 transition-all mt-2"
      >
        Volver →
      </button>
    </div>
  );

  return null;
}