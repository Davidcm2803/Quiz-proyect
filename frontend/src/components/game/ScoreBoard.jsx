export default function ScoreBoard({ scores, currentPlayer }) {
  const sorted = Object.entries(scores)
    .filter(([pid]) => pid !== "host")
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="w-full max-w-md flex flex-col gap-3">
      {sorted.map(([pid, score], i) => (
        <div
          key={pid}
          className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-white
            ${i === 0 ? "bg-[#d89e00]" : pid === currentPlayer ? "bg-[#e21b3c]" : "bg-white/10"}`}
        >
          <span className="text-xl">{i === 0 ? "🏆 " : ""}{i + 1}. {pid}</span>
          <span className="text-2xl">{score} pts</span>
        </div>
      ))}
    </div>
  );
}