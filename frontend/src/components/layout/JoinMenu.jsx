import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GamePin from "../ui/Gamepin";
import FloatingDecorations from "../ui/FloatingDecorations";
import logo from "../../assets/logo.png";

export default function JoinMenu() {
  const navigate = useNavigate();
  const [step, setStep] = useState("pin");
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handlePin = (code) => {
    setPin(code);
    setStep("nickname");
  };

  const handleJoin = () => {
    if (!nickname.trim()) { setError("Ingresa tu nombre"); return; }
    navigate(`/student/${pin}/${nickname.trim()}`);
  };

  return (
    <>
      <style>{`
        html, body, #root { margin: 0; padding: 0; overflow: hidden; height: 100%; }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .join-content { animation: fade-up 0.7s ease-out both; }
      `}</style>

      <div className="fixed inset-0 bg-[#F8FBF3] flex items-center justify-center overflow-hidden">
        <FloatingDecorations />

        <div className="join-content relative z-10 flex flex-col items-center w-[min(420px,90vw)]">
          <img src={logo} alt="QHit logo" className="w-full object-contain block -mb-[90px]" />

          {step === "pin" ? (
            <GamePin onJoin={handlePin} />
          ) : (
            <div className="flex flex-col gap-3 p-6 rounded-2xl shadow-lg w-full bg-[#fde8e0]">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="TU NOMBRE"
                autoFocus
                className="w-full text-center text-lg font-bold tracking-widest uppercase placeholder:text-gray-400 bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-800 transition-all"
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                onClick={handleJoin}
                disabled={!nickname.trim()}
                className="w-full bg-black text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                UNIRSE
              </button>
              <button onClick={() => setStep("pin")} className="text-xs text-gray-500 underline text-center">
                Cambiar código
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}