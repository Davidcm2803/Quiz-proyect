import { useState, useEffect, useRef, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function calcTimePoints(timeUsed, totalTime) {
  if (timeUsed <= 0) return 100;
  const ratio = 1 - timeUsed / totalTime;
  return Math.round(20 + ratio * 80);
}

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

export function useNormalQuiz(pin, playerId) {
  const [phase, setPhase] = useState("loading");

  const [quiz, setQuiz]                   = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [countdown, setCountdown]         = useState(0);
  const [selected, setSelected]           = useState(null);
  const [result, setResult]               = useState(null);
  const [totalScore, setTotalScore]       = useState(0);
  const [answerLog, setAnswerLog]         = useState([]);
  const [timeLeft, setTimeLeft]           = useState(null);
  const [finalPosition, setFinalPosition] = useState(null);

  const countdownRef     = useRef(null);
  const scheduledRef     = useRef(null);
  const questionStartRef = useRef(null);
  const answerLogRef     = useRef([]);
  const totalScoreRef    = useRef(0);
  const questionIndexRef = useRef(0);
  const quizRef          = useRef(null);

  useEffect(() => { answerLogRef.current   = answerLog;   }, [answerLog]);
  useEffect(() => { totalScoreRef.current  = totalScore;  }, [totalScore]);
  useEffect(() => { questionIndexRef.current = questionIndex; }, [questionIndex]);
  useEffect(() => { quizRef.current        = quiz;        }, [quiz]);

  const submitFinalResult = useCallback(async (finalLog, finalScore) => {
    setPhase("finished");
    try {
      const res = await fetch(`${API_URL}/normal/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: Number(pin),
          player: playerId,
          total_score: finalScore,
          answers: finalLog,
        }),
      });
      const data = await res.json();
      if (data.position) setFinalPosition(data.position);
    } catch {
    }
  }, [pin, playerId]);

  const loadQuestionAt = useCallback((idx, quizData) => {
    const q = quizData?.questions?.[idx];
    if (!q) {
      submitFinalResult(answerLogRef.current, totalScoreRef.current);
      return;
    }

    const isMultiple = q.answerType === "multiple";
    setSelected(isMultiple ? [] : null);
    setResult(null);
    setQuestionIndex(idx);
    questionIndexRef.current = idx;
    setCountdown(q.time || 20);
    questionStartRef.current = Date.now();
    setPhase("question");

    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          const timeoutLog = {
            question_id: q.id,
            answer: "wrong",
            points: 0,
            time_used: q.time || 20,
          };
          const newLog   = [...answerLogRef.current, timeoutLog];
          const newScore = totalScoreRef.current;

          answerLogRef.current = newLog;
          setAnswerLog(newLog);
          setResult({ correct: false, partial: false, points: 0 });
          playSound("wrong.mp3", 0.3);
          setPhase("showAnswer");

          setTimeout(() => {
            const nextIdx = idx + 1;
            if (nextIdx >= quizData.questions.length) {
              submitFinalResult(newLog, newScore);
            } else {
              loadQuestionAt(nextIdx, quizData);
            }
          }, 2000);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [submitFinalResult]);
  useEffect(() => {
    fetch(`${API_URL}/normal/quiz/${pin}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => {
        setQuiz(data);
        quizRef.current = data;

        if (data.scheduled_at) {
          const diff = new Date(data.scheduled_at).getTime() - Date.now();
          if (diff <= 0) {
            loadQuestionAt(0, data);
          } else {
            setTimeLeft(diff);
            setPhase("waiting");
          }
        } else {
          loadQuestionAt(0, data);
        }
      })
      .catch(() => setPhase("error"));
  }, [pin]);

  useEffect(() => {
    if (phase !== "waiting" || !quiz?.scheduled_at) return;

    const target = new Date(quiz.scheduled_at).getTime();

    scheduledRef.current = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) {
        clearInterval(scheduledRef.current);
        setTimeLeft(0);
        loadQuestionAt(0, quiz);
      } else {
        setTimeLeft(diff);
      }
    }, 500);

    return () => clearInterval(scheduledRef.current);
  }, [phase, quiz]);

  const submitAnswer = useCallback((i) => {
    const currentQuiz = quizRef.current;
    const idx         = questionIndexRef.current;
    if (!currentQuiz) return;

    const q          = currentQuiz.questions[idx];
    const isMultiple = q.answerType === "multiple";

    if (isMultiple) {
      if (i === "confirm") {
        clearInterval(countdownRef.current);

        setSelected((sel) => {
          const arr = Array.isArray(sel) ? sel : [];
          const { points, allCorrect, partial } = calcMultiplePoints(arr, q.answers);
          const timeUsed = (Date.now() - questionStartRef.current) / 1000;

          const logEntry = {
            question_id: q.id,
            answer: allCorrect ? "correct" : partial ? "partial" : "wrong",
            points,
            time_used: timeUsed,
          };

          const newLog   = [...answerLogRef.current, logEntry];
          const newScore = totalScoreRef.current + points;

          answerLogRef.current  = newLog;
          totalScoreRef.current = newScore;

          setAnswerLog(newLog);
          setTotalScore(newScore);
          setResult({ correct: allCorrect, partial, points });

          if (allCorrect)    playSound("correct.mp3");
          else if (partial)  playSound("correct.mp3", 0.3);
          else               playSound("wrong.mp3");

          setPhase("showAnswer");

          setTimeout(() => {
            const nextIdx = idx + 1;
            if (nextIdx >= currentQuiz.questions.length) {
              submitFinalResult(newLog, newScore);
            } else {
              loadQuestionAt(nextIdx, currentQuiz);
            }
          }, 2000);

          return arr;
        });
      } else {
        setSelected((prev) => {
          const arr = Array.isArray(prev) ? prev : [];
          return arr.includes(i) ? arr.filter((s) => s !== i) : [...arr, i];
        });
      }
    } else {
      setSelected((sel) => {
        if (sel !== null) return sel; // ya respondió
        clearInterval(countdownRef.current);

        const isCorrect = q.answers?.[i]?.is_correct ?? false;
        const totalTime = q.time || 20;
        const timeUsed  = (Date.now() - questionStartRef.current) / 1000;
        const points    = isCorrect ? calcTimePoints(timeUsed, totalTime) : 0;

        const logEntry = {
          question_id: q.id,
          answer: isCorrect ? "correct" : "wrong",
          points,
          time_used: timeUsed,
        };

        const newLog   = [...answerLogRef.current, logEntry];
        const newScore = totalScoreRef.current + points;

        answerLogRef.current  = newLog;
        totalScoreRef.current = newScore;

        setAnswerLog(newLog);
        setTotalScore(newScore);
        setResult({ correct: isCorrect, partial: false, points });

        if (isCorrect) playSound("correct.mp3");
        else           playSound("wrong.mp3");

        setPhase("showAnswer");

        setTimeout(() => {
          const nextIdx = idx + 1;
          if (nextIdx >= currentQuiz.questions.length) {
            submitFinalResult(newLog, newScore);
          } else {
            loadQuestionAt(nextIdx, currentQuiz);
          }
        }, 2000);

        return i;
      });
    }
  }, [submitFinalResult, loadQuestionAt]);

  return {
    phase,
    quiz,
    questionIndex,
    question: quiz?.questions?.[questionIndex] ?? null,
    countdown,
    selected,
    result,
    totalScore,
    timeLeft,
    finalPosition,
    submitAnswer,
  };
}