import { useState } from "react";

export default function GamePin({ onJoin }) {
  const [pin, setPin] = useState("");

  const handleSubmit = () => {
    if (pin.trim()) onJoin?.(pin.trim());
  };

  return (
    <div className="flex flex-col justify-between p-6 rounded-2xl shadow-lg w-full bg-[#fde8e0] h-[165px]">
      <input
        type="text"
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="GAME PIN"
        maxLength={8}
        className="w-full text-center text-lg font-bold tracking-widest uppercase placeholder:text-gray-400 bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-800 transition-all"
      />
      <button
        onClick={handleSubmit}
        disabled={!pin.trim()}
        className="w-full bg-black text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        LOG IN
      </button>
    </div>
  );
}