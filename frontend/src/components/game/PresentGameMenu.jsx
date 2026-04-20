import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScoreBoard from "./ScoreBoard";
import FloatingDecorations from "../ui/FloatingDecorations";
import quizsong from "../../assets/quizsong.mp3";
import { useGameAnswer } from "../../hooks/useGameAnswer";
import config from "../../config";

const WS_URL = config.WS_URL;

const COLORS = ["bg-[#e21b3c]", "bg-[#1368ce]", "bg-[#d89e00]", "bg-[#26890c]"];
const ICONS = ["▲", "◆", "●", "■"];

export default function PresentGameMenu() {
  const { roomId, playerId } = useParams();
  const navigate = useNavigate();

  const ws = useRef(null);
  const audioRef = useRef(null);
  const questionVisibleAtRef = useRef(null);

  const [phase, setPhase] = useState("waiting");
  const [question, setQuestion] = useState(null);
  const [scores, setScores] = useState({});

  const { countdown, startCountdown, selected, result, submitAnswer, resetAnswer } =
    useGameAnswer({
      question,
      ws,
      getTimeUsed: () =>
        questionVisibleAtRef.current
          ? (Date.now() - questionVisibleAtRef.current) / 1000
          : null,
      onAnswered: () => setPhase("showAnswer"),
    });

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
    if (["waiting", "starting", "question", "ranking"].includes(phase)) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "showAnswer") return;
    const t = setTimeout(() => setPhase("answered"), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    ws.current = new WebSocket(`${WS_URL}/ws/${roomId}/${playerId}`);

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ event: "joinRoom" }));
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.event === "quizStarted") setPhase("starting");

      if (data.event === "newQuestion") {
        const isMultiple = data.question?.answerType === "multiple";
        setQuestion(data.question);
        resetAnswer(isMultiple);
        setPhase("question");
        startCountdown(data.question?.time || 20);
        questionVisibleAtRef.current = Date.now();
      }

      if (data.event === "scoreUpdate") {
        setScores(data.scores);
        setPhase((current) =>
          current === "showAnswer" || current === "answered" ? current : "ranking"
        );
      }

      if (data.event === "quizEnded") {
        setScores(data.scores);
        setPhase("finished");
      }
    };

    return () => ws.current?.close();
  }, [roomId, playerId]);

  if (phase === "waiting") return (
    <div className="min-h-screen bg-[#F8FBF3] flex flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-[#292726] text-3xl font-black">¡Listo, {playerId}!</h2>
      <p className="text-[#292726]/60">Esperando que el host inicie...</p>
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 bg-[#e21b3c] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );

  if (phase === "starting") return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
      <h2 className="text-white text-5xl font-black animate-pulse">¡Prepárate!</h2>
    </div>
  );

  if (phase === "question" && question) {
    const isMultiple = question.answerType === "multiple";
    const selectedArr = Array.isArray(selected) ? selected : [];

    return (
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col relative overflow-hidden">
        <FloatingDecorations />
        <div className="h-2 bg-white/10 relative z-10">
          <div className="h-full bg-[#e21b3c] transition-all duration-1000"
            style={{ width: `${(countdown / (question.time || 20)) * 100}%` }} />
        </div>
        <div className="flex-1 flex flex-col relative z-10">
          <div className="flex justify-center pt-4 pb-2">
            <div className={`text-5xl sm:text-6xl font-black tabular-nums ${countdown <= 5 ? "text-[#e21b3c] animate-pulse" : "text-white"}`}>
              {countdown}s
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6 py-4 sm:py-6 gap-4">
            {isMultiple && (
              <p className="text-white/50 text-sm -mb-2">Selecciona todas las correctas</p>
            )}
            <div className="w-full max-w-3xl sm:max-w-4xl grid grid-cols-2 gap-4 sm:gap-5">
              {question.answers.map((_, i) => {
                const isSelected = isMultiple ? selectedArr.includes(i) : selected === i;
                return (
                  <button
                    key={i}
                    onClick={() => submitAnswer(i)}
                    disabled={!isMultiple && selected !== null}
                    className={`
                      ${COLORS[i]} rounded-2xl flex items-center justify-center
                      text-white font-black transition-all duration-150
                      active:scale-95 shadow-xl
                      disabled:opacity-30 disabled:cursor-not-allowed
                      h-60 sm:h-80 text-6xl sm:text-7xl
                      ${isSelected ? "ring-4 ring-white scale-95 brightness-110" : ""}
                    `}
                  >
                    {ICONS[i]}
                  </button>
                );
              })}
            </div>
            {isMultiple && selectedArr.length > 0 && (
              <button
                onClick={() => submitAnswer("confirm")}
                disabled={selectedArr.length === 0}
                className="bg-white text-[#1a1a2e] font-black text-lg px-10 py-3 rounded-2xl active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed mb-2"
              >
                Confirmar ({selectedArr.length})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "showAnswer") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-5 px-4">
      <div className="text-8xl">{result?.correct ? "✅" : result?.partial ? "🟡" : "❌"}</div>
      <h2 className={`text-4xl font-black ${result?.correct ? "text-green-400" : result?.partial ? "text-yellow-400" : "text-[#e21b3c]"}`}>
        {result?.correct ? "¡Correcto!" : result?.partial ? "¡Parcial!" : "Incorrecto"}
      </h2>
      {result?.points > 0 && (
        <p className="text-white text-2xl font-bold">+{result.points} pts</p>
      )}
    </div>
  );

  if (phase === "answered") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-4 px-4">
      <div className="text-6xl">{result?.correct ? "✅" : result?.partial ? "🟡" : "❌"}</div>
      <h2 className={`text-3xl font-black ${result?.correct ? "text-green-400" : result?.partial ? "text-yellow-400" : "text-[#e21b3c]"}`}>
        {result?.correct ? "¡Correcto!" : result?.partial ? "Parcial" : "Incorrecto"}
      </h2>
      {result?.points > 0 && (
        <p className="text-white text-xl font-bold">+{result.points} pts</p>
      )}
      <ScoreBoard scores={scores} currentPlayer={playerId} />
      <p className="text-white/40 text-sm mt-2">Esperando siguiente pregunta...</p>
    </div>
  );

  if (phase === "ranking") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-white text-3xl font-black">Ranking</h2>
      <ScoreBoard scores={scores} currentPlayer={playerId} />
      <p className="text-white/40 text-sm">Cargando siguiente pregunta...</p>
    </div>
  );

  if (phase === "finished") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-white text-4xl font-black">¡Quiz finalizado!</h2>
      <ScoreBoard scores={scores} currentPlayer={playerId} />
      <button onClick={() => navigate("/join")}
        className="bg-white text-[#1a1a2e] font-bold px-8 py-4 rounded-2xl active:scale-95 transition-all mt-2">
        Volver →
      </button>
    </div>
  );

  return null;
}