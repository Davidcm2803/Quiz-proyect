import { useState } from "react";
import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import ScoreBoard from "./ScoreBoard";
import Navbar from "../layout/Navbar";
import Button from "../ui/Button";
import { getQuizFullByPin } from "../../database/database";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

const COLORS = ["bg-[#e21b3c]", "bg-[#1368ce]", "bg-[#d89e00]", "bg-[#26890c]"];
const ICONS = ["▲", "◆", "●", "■"];

const MODE_LABELS = {
  normal: { label: "Normal", icon: "🎮", color: "bg-gray-100 text-gray-600" },
  presentacion: { label: "Presentación", icon: "📺", color: "bg-purple-100 text-purple-600" },
};

export default function HostGameMenu() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const ws = useRef(null);

  const [phase, setPhase] = useState("lobby");
  const [players, setPlayers] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizMode, setQuizMode] = useState("normal");
  const [scheduledAt, setScheduledAt] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answersIn, setAnswersIn] = useState(0);
  const [scores, setScores] = useState({});
  const [countdown, setCountdown] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeUntilStart, setTimeUntilStart] = useState(null);
  const [showingScores, setShowingScores] = useState(false);
  const countdownRef = useRef(null);
  const qIndexRef = useRef(0);
  const autoStartRef = useRef(null);
  const hasAutoStarted = useRef(false);
  const questionsRef = useRef([]);
  const pendingAutoStart = useRef(false);

  const current = quizQuestions[qIndex];

  useEffect(() => {
    getQuizFullByPin(roomId)
      .then((data) => {
        if (data && data.questions && data.questions.length > 0) {
          setQuizQuestions(data.questions);
          questionsRef.current = data.questions;
          setQuizTitle(data.title);
          setQuizMode(data.mode || "normal");
          setScheduledAt(data.scheduled_at || null);
        } else {
          setError("No se encontró el quiz o no tiene preguntas.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar el quiz.");
        setLoading(false);
      });
  }, [roomId]);

  useEffect(() => {
    if (!scheduledAt || quizMode !== "normal") return;
    const tick = () => {
      const diff = new Date(scheduledAt).getTime() - Date.now();
      setTimeUntilStart(Math.max(0, diff));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [scheduledAt, quizMode]);

  useEffect(() => {
    if (!scheduledAt || quizMode !== "normal" || phase !== "lobby") return;
    if (hasAutoStarted.current) return;

    const delay = new Date(scheduledAt).getTime() - Date.now();

    const trigger = () => {
      if (hasAutoStarted.current) return;
      hasAutoStarted.current = true;
      if (ws.current?.readyState === WebSocket.OPEN) {
        startQuizWithQuestions(questionsRef.current);
      } else {
        pendingAutoStart.current = true;
      }
    };

    if (delay <= 0) { trigger(); return; }

    autoStartRef.current = setTimeout(trigger, delay);
    return () => clearTimeout(autoStartRef.current);
  }, [scheduledAt, quizMode, phase]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      ws.current = new WebSocket(`${WS_URL}/ws/${roomId}/host`);
      ws.current.onopen = () => {
        if (pendingAutoStart.current) {
          pendingAutoStart.current = false;
          startQuizWithQuestions(questionsRef.current);
        }
      };
      ws.current.onerror = (e) => console.error("❌ WS error:", e);
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.event === "playerJoined")
          setPlayers((prev) => prev.includes(data.playerId) ? prev : [...prev, data.playerId]);
        if (data.event === "answerSubmitted")
          setAnswersIn((prev) => prev + 1);
        if (data.event === "scoreUpdate") {
          setScores(data.scores);
          setPhase("scores");
          setShowingScores(false);
          clearInterval(countdownRef.current);
        }
        if (data.event === "quizEnded") {
          setScores(data.scores);
          setPhase("finished");
        }
      };
    }, 100);
    return () => {
      clearTimeout(timeout);
      ws.current?.close();
      clearInterval(countdownRef.current);
    };
  }, [roomId]);

  const send = (payload) => ws.current?.send(JSON.stringify(payload));

  const startCountdown = (secs, onEnd) => {
    clearInterval(countdownRef.current);
    setCountdown(secs);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          if (onEnd) onEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const launchQuestion = (index, questions) => {
    const list = questions || questionsRef.current;
    const q = list[index];
    if (!q) return;
    qIndexRef.current = index;
    setQIndex(index);
    setAnswersIn(0);
    setShowingScores(false);
    setPhase("question");
    send({
      event: "newQuestion",
      question: {
        id: q._id,
        text: q.text,
        image: q.image ?? null,
        answers: q.answers,
        time: q.time,
        answerType: q.answerType,
      },
    });
    startCountdown(q.time || 20);
  };

  const startQuiz = () => {
    clearTimeout(autoStartRef.current);
    hasAutoStarted.current = true;
    send({ event: "startQuiz" });
    launchQuestion(0, questionsRef.current);
  };

  const startQuizWithQuestions = (questions) => {
    clearTimeout(autoStartRef.current);
    send({ event: "startQuiz" });
    launchQuestion(0, questions);
  };

  const broadcastScores = () => send({ event: "updateScore" });

  const nextQuestion = () => {
    const next = qIndexRef.current + 1;
    if (next >= quizQuestions.length) {
      send({ event: "endQuiz" });
      return;
    }
    launchQuestion(next, quizQuestions);
  };

  const formatTime = (ms) => {
    if (ms === null || ms === undefined) return "";
    const s = Math.ceil(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  };

  if (loading) return (
    <div className="bg-[#F8FBF3] min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-gray-400 text-lg animate-pulse">Cargando quiz...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-[#F8FBF3] min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <p className="text-red-400 text-lg">{error}</p>
        <Button variant="save" onClick={() => navigate("/")}>Volver al inicio</Button>
      </div>
    </div>
  );

  const modeInfo = MODE_LABELS[quizMode] || MODE_LABELS.normal;
  const hasScheduled = !!scheduledAt;
  const scheduledInFuture = hasScheduled && timeUntilStart !== null && timeUntilStart > 0;
  const joinUrl = `${window.location.origin}/present/${roomId}`;

  if (phase === "lobby") return (
    <div className="bg-[#F8FBF3] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl flex flex-col gap-5">
          <div className="bg-white rounded-3xl shadow-[0_8px_48px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden">
            <div className="bg-[#fde8e0] px-10 py-10 text-center">
              <p className="text-[#1a1a1a]/40 text-xs font-bold uppercase tracking-widest mb-3">Código de sala</p>
              <h1 className="text-7xl font-black tracking-[0.15em] font-mono text-[#1a1a1a]">{roomId}</h1>
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                <span className="text-[#1a1a1a]/70 text-base font-semibold">{quizTitle}</span>
                <span className="w-1 h-1 rounded-full bg-[#1a1a1a]/30" />
                <span className="text-[#1a1a1a]/40 text-sm">
                  {quizQuestions.length} {quizQuestions.length === 1 ? "pregunta" : "preguntas"}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#1a1a1a]/30" />
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${modeInfo.color}`}>
                  {modeInfo.icon} {modeInfo.label}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 mt-6">
                <QRCodeSVG
                  value={joinUrl}
                  size={140}
                  bgColor="transparent"
                  fgColor="#1a1a1a"
                  className="rounded-xl"
                />
                <p className="text-[#1a1a1a]/40 text-xs">Escanea para unirte</p>
              </div>
            </div>

            <div className="px-8 py-7">
              <div className="flex items-center justify-between mb-5">
                <p className="text-gray-700 font-bold text-sm">Jugadores en sala</p>
                <span className="bg-[#fde8e0] text-[#e21b3c] text-xs font-bold px-3 py-1.5 rounded-full">
                  {players.length} conectados
                </span>
              </div>
              <div className="min-h-[100px] flex flex-wrap gap-2 content-start">
                {players.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center py-6 gap-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2 h-2 bg-[#fde8e0] rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm">Esperando jugadores...</p>
                  </div>
                ) : (
                  players.map((p, i) => (
                    <span key={i} className="bg-[#fde8e0] text-[#1a1a1a] text-sm px-4 py-2 rounded-full font-semibold">{p}</span>
                  ))
                )}
              </div>
            </div>

            <div className="h-px bg-gray-100 mx-8" />

            {quizMode === "normal" && (
              <div className="px-8 py-6 flex flex-col gap-3">
                {hasScheduled ? (
                  <div className={`w-full rounded-2xl px-5 py-4 text-center border ${scheduledInFuture ? "bg-amber-50 border-amber-100" : "bg-green-50 border-green-100"}`}>
                    {scheduledInFuture ? (
                      <>
                        <p className="text-amber-700 font-bold text-sm">⏰ Inicio automático programado</p>
                        <p className="text-amber-400 text-2xl font-black font-mono mt-2">{formatTime(timeUntilStart)}</p>
                        <p className="text-amber-300 text-xs mt-1">{new Date(scheduledAt).toLocaleString()}</p>
                      </>
                    ) : (
                      <p className="text-green-700 font-bold text-sm">✅ Iniciando...</p>
                    )}
                  </div>
                ) : null}
                <button
                  onClick={startQuiz}
                  className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white font-bold text-base py-4 rounded-2xl transition-all active:scale-95"
                >
                  Iniciar ahora →
                </button>
              </div>
            )}

            {quizMode === "presentacion" && (
              <div className="px-8 py-6">
                <button
                  onClick={startQuiz}
                  disabled={players.length === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl transition-all active:scale-95"
                >
                  {players.length === 0 ? "Esperando jugadores" : "📺 Iniciar Presentación →"}
                </button>
              </div>
            )}
          </div>
          <p className="text-center text-gray-400 text-xs">
            Los jugadores pueden unirse en <span className="font-semibold text-gray-500">/join</span> con el código de sala
          </p>
        </div>
      </div>
    </div>
  );

  if (phase === "question" && current) return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col relative overflow-hidden">
      <div className="h-2 bg-white/10 relative z-10">
        <div className="h-full bg-[#26890c] transition-all duration-1000"
          style={{ width: `${(countdown / (current.time || 20)) * 100}%` }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-between px-4 py-5 gap-4 relative z-10">
        <div className="w-full flex justify-between items-center max-w-5xl">
          <span className="text-[#a0a0b0] text-sm font-semibold">{qIndex + 1} / {quizQuestions.length}</span>
          <span className={`text-4xl font-black tabular-nums ${countdown <= 5 ? "text-[#e21b3c] animate-pulse" : "text-white"}`}>
            {countdown}s
          </span>
          <span className="text-[#a0a0b0] text-sm font-semibold">{answersIn}/{players.length} respondieron</span>
        </div>

        {current.answerType === "multiple" && (
          <span className="bg-white/10 text-white/50 text-xs font-semibold px-3 py-1 rounded-full">
            Selección múltiple
          </span>
        )}
        <h2 className="text-white font-bold text-center text-2xl sm:text-5xl w-full max-w-5xl pb-4">
          {current.text}
        </h2>

        {current.image && (
          <img src={current.image} alt="" className="w-full max-w-5xl max-h-[260px] sm:max-h-[320px] object-contain rounded-2xl" />
        )}

        {showingScores ? (
          <div className="w-full max-w-5xl flex flex-col items-center gap-4">
            <ScoreBoard scores={scores} />
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setShowingScores(false)}>← Volver</Button>
              <Button variant="save" onClick={() => { broadcastScores(); }}>Mostrar scores a todos</Button>
              <Button variant="save" onClick={nextQuestion}>
                {qIndex + 1 >= quizQuestions.length ? "Finalizar" : "Siguiente →"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full max-w-5xl grid grid-cols-2 gap-4 sm:gap-5">
              {current.answers.map((ans, i) => (
                <div key={i} className={`${COLORS[i]} rounded-2xl flex items-center justify-center gap-4 text-white font-black shadow-xl h-24 sm:h-32 px-6`}>
                  <span className="text-4xl sm:text-5xl">{ICONS[i]}</span>
                  <span className="text-lg sm:text-xl leading-tight text-center">{ans.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setShowingScores(true)}>Ver scores</Button>
              <Button variant="save" onClick={() => { broadcastScores(); }}>
                {qIndex + 1 >= quizQuestions.length ? "Finalizar" : "Siguiente →"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (phase === "scores") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-white text-4xl font-black">Ranking</h2>
      <ScoreBoard scores={scores} />
      <Button variant="save" size="lg" onClick={nextQuestion}>
        {qIndex + 1 >= quizQuestions.length ? "Finalizar quiz" : "Siguiente pregunta →"}
      </Button>
    </div>
  );

  if (phase === "finished") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-white text-4xl font-black">¡Quiz finalizado!</h2>
      <ScoreBoard scores={scores} />
      <Button variant="primary" size="lg" onClick={() => navigate("/")}>Volver al inicio</Button>
    </div>
  );

  return null;
}