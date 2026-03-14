import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AnswerButtons from "../ui/AnswerButtons";
import ScoreBoard from "./ScoreBoard";

const WS_URL = "ws://localhost:8000";

export default function StudentGameMenu() {
  const { roomId, playerId } = useParams();
  const ws = useRef(null);

  const [phase, setPhase] = useState("waiting");
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({});
  const [countdown, setCountdown] = useState(20);
  const countdownRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`${WS_URL}/ws/${roomId}/${playerId}`);
    ws.current.onopen = () => ws.current.send(JSON.stringify({ event: "joinRoom" }));
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.event === "playerJoined")
        setPlayers((prev) => prev.includes(data.playerId) ? prev : [...prev, data.playerId]);

      if (data.event === "quizStarted")
        setPhase("starting");

      if (data.event === "newQuestion") {
        console.log("pregunta recibida:", data.question);
        console.log("answerType:", data.question?.answerType);
        const isMultiple = data.question?.answerType === "multiple";
        setQuestion(data.question);
        setSelected(isMultiple ? [] : null);
        setResult(null);
        setPhase("question");
        startCountdown(data.question?.time || 20);
      }

      if (data.event === "scoreUpdate") {
        setScores(data.scores);
        setPhase("ranking");
        clearInterval(countdownRef.current);
      }

      if (data.event === "quizEnded") {
        setScores(data.scores);
        setPhase("finished");
        clearInterval(countdownRef.current);
      }
    };
    return () => { ws.current?.close(); clearInterval(countdownRef.current); };
  }, [roomId, playerId]);

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

  const submitAnswer = (i) => {
    if (!question) return;
    const isMultiple = question.answerType === "multiple";

    if (isMultiple) {
      if (i === "confirm") {
        const correctIndexes = question.answers
          .map((a, idx) => a.is_correct ? idx : null)
          .filter((v) => v !== null);

        const totalCorrect = correctIndexes.length;
        const acertadas = selected.filter((s) => correctIndexes.includes(s)).length;
        const incorrectas = selected.filter((s) => !correctIndexes.includes(s)).length;

        const points = incorrectas > 0 ? 0 : Math.round((acertadas / totalCorrect) * 100);
        const allCorrect = acertadas === totalCorrect && incorrectas === 0;
        const partial = points > 0 && !allCorrect;

        clearInterval(countdownRef.current);
        ws.current.send(JSON.stringify({
          event: "submitAnswer",
          questionId: question.id,
          answer: allCorrect ? "correct" : partial ? "partial" : "wrong",
          points,
        }));
        setResult({ correct: allCorrect, partial, points });
        setPhase("result");
      } else {
        setSelected((prev) => {
          const arr = Array.isArray(prev) ? prev : [];
          return arr.includes(i) ? arr.filter((s) => s !== i) : [...arr, i];
        });
      }
    } else {
      if (selected !== null) return;
      setSelected(i);
      clearInterval(countdownRef.current);
      const isCorrect = question.answers?.[i]?.is_correct ?? false;
      ws.current.send(JSON.stringify({
        event: "submitAnswer",
        questionId: question.id,
        answer: isCorrect ? "correct" : "wrong",
        points: isCorrect ? 100 : 0,
      }));
      setResult({ correct: isCorrect, partial: false, points: isCorrect ? 100 : 0 });
      setPhase("result");
    }
  };

  if (phase === "waiting") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-white text-3xl font-black">¡Listo, {playerId}!</h2>
      <p className="text-[#a0a0b0]">Esperando que el host inicie...</p>
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {players.map((p, i) => (
          <span key={i} className="bg-white/10 text-white text-sm px-4 py-2 rounded-full">{p}</span>
        ))}
      </div>
      <div className="flex gap-1 mt-2">
        {[0,1,2].map((i) => (
          <div key={i} className="w-2 h-2 bg-[#e21b3c] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );

  if (phase === "starting") return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
      <h2 className="text-white text-5xl font-black animate-pulse">Estás listo??!</h2>
    </div>
  );

  if (phase === "question" && question) {
    const isMultiple = question.answerType === "multiple";
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col">
        <div className="h-2 bg-white/10">
          <div className="h-full bg-[#e21b3c] transition-all duration-1000" style={{ width: `${(countdown / (question.time || 20)) * 100}%` }} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-between px-4 py-8">
          <div className="text-center max-w-lg">
            {isMultiple && (
              <span className="bg-white/10 text-white/60 text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
                Selección múltiple — puedes elegir varias!
              </span>
            )}
            <h2 className="text-white text-2xl md:text-3xl font-black mt-2">{question.text}</h2>
          </div>
          <div className={`text-6xl font-black ${countdown <= 5 ? "text-[#e21b3c]" : "text-white"}`}>{countdown}</div>
          <AnswerButtons
            answers={question.answers || []}
            selected={selected}
            onSelect={submitAnswer}
            answerType={question.answerType}
          />
        </div>
      </div>
    );
  }

  if (phase === "result") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-4 px-4">
      <div className="text-8xl">
        {result?.correct ? "✅" : result?.partial ? "🟡" : "❌"}
      </div>
      <h2 className={`text-4xl font-black ${result?.correct ? "text-green-400" : result?.partial ? "text-yellow-400" : "text-[#e21b3c]"}`}>
        {result?.correct ? "¡Correcto!" : result?.partial ? "¡Parcial!" : "Incorrecto"}
      </h2>
      {result?.points > 0 && (
        <p className="text-white text-xl font-bold">+{result.points} puntos</p>
      )}
      {result?.partial && (
        <p className="text-yellow-400/70 text-sm">Acertaste algunas respuestas</p>
      )}
      <p className="text-[#a0a0b0] text-sm mt-4">Esperando siguiente pregunta...</p>
    </div>
  );

  if (phase === "ranking") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-white text-3xl font-black">Ranking</h2>
      <ScoreBoard scores={scores} currentPlayer={playerId} />
      <p className="text-[#a0a0b0] text-sm">Esperando siguiente pregunta...</p>
    </div>
  );

  if (phase === "finished") return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-white text-4xl font-black">¡Quiz finalizado!</h2>
      <ScoreBoard scores={scores} currentPlayer={playerId} />
    </div>
  );

  return null;
}