import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentGameMenu from "../components/game/StudentGameMenu";
import { getQuizFullByPin } from "../database/database";

export default function StudentGame() {
  const { roomId, playerId } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (String(roomId).startsWith("daily-")) {
      setMode("normal");
      setLoading(false);
      return;
    }
    getQuizFullByPin(roomId)
      .then((data) => {
        const quizMode = data?.mode || "normal";
        if (quizMode === "presentacion") {
          navigate(`/present/${roomId}/${playerId}`, { replace: true });
        } else {
          setMode(quizMode);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [roomId, playerId, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#F8FBF3] flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Cargando...</p>
    </div>
  );

  return <StudentGameMenu />;
}