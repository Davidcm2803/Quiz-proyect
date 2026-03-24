import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScoreBoard from "./ScoreBoard";
import Navbar from "../layout/Navbar";
import Button from "../ui/Button";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const COLORS = ["bg-[#e21b3c]", "bg-[#1368ce]", "bg-[#d89e00]", "bg-[#26890c]"];
const ICONS = ["▲", "◆", "●", "■"];

export default function HostGameMenu() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const ws = useRef(null);

  const [phase, setPhase] = useState("lobby");
  const [players, setPlayers] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [answersIn, setAnswersIn] = useState(0);
  const [scores, setScores] = useState({});
  const [countdown, setCountdown] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const countdownRef = useRef(null);

  const current = quizQuestions[qIndex];

  useEffect(() => {
    fetch(`${API_URL}/quizzes/full/by-pin/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.questions && data.questions.length > 0) {
          setQuizQuestions(data.questions);
          setQuizTitle(data.title);
        } else {
          setError("No se encontró el quiz o no tiene preguntas.");
        }
        setLoading(false);
      })
      .catch(() => { setError("Error al cargar el quiz."); setLoading(false); });
  }, [roomId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      ws.current = new WebSocket(`${WS_URL}/ws/${roomId}/host`);
      ws.current.onopen = () => console.log("Host conectado");
      ws.current.onerror = (e) => console.error("WS error:", e);
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.event === "playerJoined")
          setPlayers((prev) => prev.includes(data.playerId) ? prev : [...prev, data.playerId]);
        if (data.event === "answerSubmitted")
          setAnswersIn((prev) => prev + 1);
        if (data.event === "scoreUpdate") {
          setScores(data.scores);
          setPhase("scores");
          clearInterval(countdownRef.current);
        }
        if (data.event === "quizEnded") {
          setScores(data.scores);
          setPhase("finished");
        }
      };
    }, 100);
    return () => { clearTimeout(timeout); ws.current?.close(); clearInterval(countdownRef.current); };
  }, [roomId]);

  const send = (payload) => ws.current?.send(JSON.stringify(payload));

  const startCountdown = (secs) => {
    clearInterval(countdownRef.current);
    setCountdown(secs);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(countdownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const launchQuestion = (index) => {
    const q = quizQuestions[index];
    if (!q) return;
    setAnswersIn(0);
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
      }
    });
    startCountdown(q.time || 20);
  };

  const startQuiz = () => { send({ event: "startQuiz" }); launchQuestion(0); };
  const showScores = () => send({ event: "updateScore" });
  const nextQuestion = () => {
    const next = qIndex + 1;
    if (next >= quizQuestions.length) { send({ event: "endQuiz" }); return; }
    setQIndex(next);
    launchQuestion(next);
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

  if (phase === "lobby") return (
    <div className="bg-[#F8FBF3] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl flex flex-col gap-5">
          <div className="bg-white rounded-3xl shadow-[0_8px_48px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden">
            <div className="bg-[#fde8e0] px-10 py-10 text-center">
              <p className="text-[#1a1a1a]/40 text-xs font-bold uppercase tracking-widest mb-3">Código de sala</p>
              <h1 className="text-7xl font-black tracking-[0.15em] font-mono text-[#1a1a1a]">{roomId}</h1>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-[#1a1a1a]/70 text-base font-semibold">{quizTitle}</span>
                <span className="w-1 h-1 rounded-full bg-[#1a1a1a]/30" />
                <span className="text-[#1a1a1a]/40 text-sm">{quizQuestions.length} {quizQuestions.length === 1 ? "pregunta" : "preguntas"}</span>
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
                      {[0,1,2].map((i) => (
                        <div key={i} className="w-2 h-2 bg-[#fde8e0] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
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
            <div className="px-8 py-6">
              <button
                onClick={startQuiz}
                disabled={players.length === 0}
                className="w-full bg-[#1a1a1a] hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl transition-all active:scale-95"
              >
                {players.length === 0 ? "Esperando jugadores para iniciar" : "Iniciar Quiz →"}
              </button>
            </div>
          </div>
          <p className="text-center text-gray-400 text-xs">
            Los jugadores pueden unirse en <span className="font-semibold text-gray-500">/join</span> con el código de sala
          </p>
        </div>
      </div>
    </div>
  );

  if (phase === "question" && current) return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col">
      <div className="h-2 bg-white/10">
        <div className="h-full bg-[#26890c] transition-all duration-1000" style={{ width: `${(countdown / (current.time || 20)) * 100}%` }} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-between px-4 py-8 gap-6">
        <div className="w-full flex justify-between items-center max-w-2xl">
          <span className="text-[#a0a0b0] text-sm">Pregunta {qIndex + 1}/{quizQuestions.length}</span>
          <span className={`text-3xl font-black ${countdown <= 5 ? "text-[#e21b3c]" : "text-white"}`}>{countdown}s</span>
          <span className="text-[#a0a0b0] text-sm">{answersIn}/{players.length} respondieron</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl px-8 py-8 text-center max-w-2xl w-full">
          {current.answerType === "multiple" && (
            <span className="bg-white/10 text-white/50 text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">
              Selección múltiple
            </span>
          )}
          {current.image && (
            <img
              src={current.image}
              alt=""
              className="w-full max-h-48 object-contain rounded-2xl mb-4"
            />
          )}
          <h2 className="text-white text-3xl font-black mt-2">{current.text}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
          {current.answers.map((ans, i) => (
            <div key={i} className={`${COLORS[i]} rounded-2xl px-5 py-5 flex items-center gap-3`}>
              <span className="text-white text-2xl">{ICONS[i]}</span>
              <span className="text-white font-bold text-lg">{ans.text}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={showScores}>Ver scores</Button>
          <Button variant="save" onClick={nextQuestion}>
            {qIndex + 1 >= quizQuestions.length ? "Finalizar" : "Siguiente →"}
          </Button>
        </div>
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