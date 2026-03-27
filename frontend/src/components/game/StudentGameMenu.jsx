import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnswerButtons from "../ui/AnswerButtons";
import ScoreBoard from "./ScoreBoard";
import FloatingDecorations from "../ui/FloatingDecorations";
import quizsong from "../../assets/quizsong.mp3";
import { getQuizFullByPin } from "../../database/database";
import { useGameAnswer } from "../../hooks/useGameAnswer";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

function useCountdownToDate(targetDateStr) {
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (!targetDateStr) return;
    const target = new Date(targetDateStr).getTime();
    const tick = () => setTimeLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDateStr]);
  return timeLeft;
}

function formatCountdown(ms) {
  if (ms === null) return "";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export default function StudentGameMenu({ mode }) {
  const { roomId, playerId } = useParams();
  const navigate = useNavigate();

  const ws = useRef(null);
  const audioRef = useRef(null);
  const autoStartedRef = useRef(false);

  const [phase, setPhase] = useState("waiting");
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [scores, setScores] = useState({});
  const [scheduledAt, setScheduledAt] = useState(null);

  const timeLeft = useCountdownToDate(scheduledAt);

  const { countdown, startCountdown, selected, result, submitAnswer, resetAnswer } =
    useGameAnswer({
      question,
      ws,
      onAnswered: () => setPhase("showAnswer"),
    });

  // Load scheduled time for "normal" mode
  useEffect(() => {
    if (mode !== "normal") return;
    getQuizFullByPin(roomId)
      .then((data) => {
        if (data?.scheduled_at) setScheduledAt(data.scheduled_at);
      })
      .catch(() => {});
  }, [mode, roomId]);

  // Auto-start when countdown hits 0 in "normal" mode
  useEffect(() => {
    if (mode !== "normal") return;
    if (!scheduledAt) return;
    if (autoStartedRef.current) return;
    if (timeLeft === null || timeLeft > 0) return;

    autoStartedRef.current = true;
    setPhase("starting");
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ event: "autoStart" }));
    }
  }, [timeLeft, mode, scheduledAt]);

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
    if (["waiting", "starting", "question", "result", "ranking"].includes(phase)) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [phase]);

  useEffect(() => {
    ws.current = new WebSocket(`${WS_URL}/ws/${roomId}/${playerId}`);

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ event: "joinRoom" }));
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.event === "playerJoined") {
        setPlayers((prev) =>
          prev.includes(data.playerId) ? prev : [...prev, data.playerId]
        );
      }
      if (data.event === "quizStarted") setPhase("starting");

      if (data.event === "newQuestion") {
        const isMultiple = data.question?.answerType === "multiple";
        setQuestion(data.question);
        resetAnswer(isMultiple);
        setPhase("question");
        startCountdown(data.question?.time || 20);
      }

      if (data.event === "scoreUpdate") {
        setScores(data.scores);
        setPhase("ranking");
      }

      if (data.event === "quizEnded") {
        setScores(data.scores);
        setPhase("finished");
      }
    };

    return () => ws.current?.close();
  }, [roomId, playerId]);

  if (phase === "waiting") {
    const isNormal = mode === "normal";
    const notYet = isNormal && scheduledAt && timeLeft !== null && timeLeft > 0;

    return (
      <div className="min-h-screen bg-[#F8FBF3] flex flex-col items-center justify-center gap-6 px-4">
        <h2 className="text-[#292726] text-3xl font-black">¡Listo, {playerId}!</h2>

        {notYet ? (
          <>
            <p className="text-[#292726]/60">El quiz se abre en:</p>
            <div className="bg-[#1a1a2e] text-white text-5xl font-black px-10 py-6 rounded-3xl">
              {formatCountdown(timeLeft)}
            </div>
            <p className="text-[#292726]/40 text-sm text-center max-w-xs">
              Comenzará automáticamente cuando llegue la hora.
            </p>
          </>
        ) : (
          <>
            <p className="text-[#292726]/60">
              {isNormal
                ? "Esperando hora de inicio..."
                : "Esperando que el host inicie..."}
            </p>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-[#e21b3c] rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </>
        )}

        {players.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {players.map((p, i) => (
              <span key={i} className="bg-[#1a1a2e]/10 px-3 py-1 rounded-full text-sm">{p}</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (phase === "starting") return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
      <h2 className="text-white text-5xl font-black animate-pulse">¡Prepárate!</h2>
    </div>
  );

  if (phase === "question" && question) {
    const hasImage = !!question.image;
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col relative overflow-hidden">
        <FloatingDecorations />
        <div className="h-2 bg-white/10 relative z-10">
          <div className="h-full bg-[#e21b3c] transition-all duration-1000"
            style={{ width: `${(countdown / (question.time || 20)) * 100}%` }} />
        </div>
        <div className="flex-1 flex flex-col items-center gap-4 px-4 py-5 relative z-10">
          <div className={`text-5xl font-black tabular-nums ${countdown <= 5 ? "text-[#e21b3c] animate-pulse" : "text-white"}`}>
            {countdown}s
          </div>
          {question.answerType === "multiple" && (
            <span className="bg-white/10 text-white/50 text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
              Selección múltiple
            </span>
          )}
          <h2 className="text-white font-bold text-center text-2xl sm:text-5xl w-full max-w-5xl pb-4">
            {question.text}
          </h2>
          {hasImage && (
            <div className="w-full max-w-3xl">
              <img
                src={question.image}
                alt=""
                className="w-full max-w-5xl max-h-[300px] sm:max-h-[380px] object-contain rounded-2xl"
              />
            </div>
          )}
          <div className="w-full max-w-3xl mt-auto">
            <AnswerButtons
              answers={question.answers}
              selected={selected}
              onSelect={submitAnswer}
              answerType={question.answerType}
            />
          </div>
        </div>
      </div>
    );
  }

  if (phase === "showAnswer") {
    setTimeout(() => setPhase("result"), 1500);
    return (
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
  }

  if (phase === "result") return (
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