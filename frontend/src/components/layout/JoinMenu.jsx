import GamePin from "../ui/Gamepin";
import FloatingDecorations from "../ui/FloatingDecorations";
import logo from "../../assets/logo.png";

export default function JoinMenu() {
  const handleJoin = (pin) => console.log("Joining with pin:", pin);

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
          <img
            src={logo}
            alt="QHit logo"
            className="w-full object-contain block -mb-[90px]"
          />
          <GamePin onJoin={handleJoin} />
        </div>
      </div>
    </>
  );
}