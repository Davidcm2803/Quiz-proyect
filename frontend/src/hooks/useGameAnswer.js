import { useRef, useState } from "react";

// Puntos por velocidad
function calcTimePoints(timeUsed, totalTime) {
  if (timeUsed <= 0) return 100;
  const ratio = 1 - timeUsed / totalTime;
  return Math.round(20 + ratio * 80);
}

// - Incorrectas → 0 pts
// - Todas correctas → 100 pts
// - Parcial (solo acertadas, sin incorrectas)
function calcMultiplePoints(selected, answers) {
  const correctIndexes = answers
    .map((a, idx) => (a.is_correct ? idx : null))
    .filter((v) => v !== null);

  const totalCorrect = correctIndexes.length;
  const acertadas = selected.filter((s) => correctIndexes.includes(s)).length;
  const incorrectas = selected.filter((s) => !correctIndexes.includes(s)).length;

  const points =
    incorrectas > 0 ? 0 : Math.round((acertadas / totalCorrect) * 100);

  const allCorrect = acertadas === totalCorrect && incorrectas === 0;
  const partial = points > 0 && !allCorrect;

  return { points, allCorrect, partial };
}

const playSound = (src, volume = 0.6) => {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(() => {});
};

/**
 *
 * @param {object} params
 * @param {object|null} params.question  - Pregunta activa
 * @param {object}      params.ws        - ref del WebSocket (.current)
 * @param {function}    params.onAnswered - Callback cuando se confirma la respuesta y recibe { correct, partial, points }
 *
 * @returns {{
 *   countdown: number,
 *   startCountdown: (secs: number) => void,
 *   selected: null | number | number[],
 *   setSelected: function,
 *   result: { correct: boolean, partial: boolean, points: number } | null,
 *   submitAnswer: (i: number | "confirm") => void,
 *   resetAnswer: () => void,
 * }}
 */
export function useGameAnswer({ question, ws, onAnswered }) {
  const countdownRef = useRef(null);

  const [countdown, setCountdown] = useState(20);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const startCountdown = (secs) => {
    clearInterval(countdownRef.current);
    setCountdown(secs);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopCountdown = () => clearInterval(countdownRef.current);
  const resetAnswer = (isMultiple = false) => {
    setSelected(isMultiple ? [] : null);
    setResult(null);
  };

  const submitAnswer = (i) => {
    if (!question || !ws.current) return;
    const isMultiple = question.answerType === "multiple";

    if (isMultiple) {
      if (i === "confirm") {
        const { points, allCorrect, partial } = calcMultiplePoints(selected, question.answers);
        stopCountdown();

        ws.current.send(JSON.stringify({
          event: "submitAnswer",
          questionId: question.id,
          answer: allCorrect ? "correct" : partial ? "partial" : "wrong",
          points,
        }));

        if (allCorrect) playSound("correct.mp3");
        else if (partial) playSound("correct.mp3", 0.3);
        else playSound("wrong.mp3");

        const res = { correct: allCorrect, partial, points };
        setResult(res);
        onAnswered(res);
      } else {
        setSelected((prev) => {
          const arr = Array.isArray(prev) ? prev : [];
          return arr.includes(i) ? arr.filter((s) => s !== i) : [...arr, i];
        });
      }
    } else {
      if (selected !== null) return;
      setSelected(i);
      stopCountdown();

      const totalTime = question.time || 20;
      const timeUsed = totalTime - countdown;
      const isCorrect = question.answers?.[i]?.is_correct ?? false;
      const points = isCorrect ? calcTimePoints(timeUsed, totalTime) : 0;

      ws.current.send(JSON.stringify({
        event: "submitAnswer",
        questionId: question.id,
        answer: isCorrect ? "correct" : "wrong",
        points,
      }));

      if (isCorrect) playSound("correct.mp3");
      else playSound("wrong.mp3");

      const res = { correct: isCorrect, partial: false, points };
      setResult(res);
      onAnswered(res);
    }
  };

  return {
    countdown,
    startCountdown,
    selected,
    setSelected,
    result,
    submitAnswer,
    resetAnswer,
  };
}