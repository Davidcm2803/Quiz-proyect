const COLORS = [
  { bg: "bg-[#e21b3c]", hover: "hover:bg-[#c41535]", icon: "▲" },
  { bg: "bg-[#1368ce]", hover: "hover:bg-[#0f52a8]", icon: "◆" },
  { bg: "bg-[#d89e00]", hover: "hover:bg-[#b58400]", icon: "●" },
  { bg: "bg-[#26890c]", hover: "hover:bg-[#1e6e09]", icon: "■" },
];

export default function AnswerButtons({ answers, selected, onSelect, answerType }) {
  const isMultiple = answerType === "multiple";

  const isSelected = (i) =>
    isMultiple
      ? Array.isArray(selected) && selected.includes(i)
      : selected === i;

  const isDisabled = (i) =>
    !isMultiple && selected !== null && selected !== i;

  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
      {answers.map((ans, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          disabled={!isMultiple && selected !== null}
          className={`
            ${COLORS[i].bg} ${!isSelected(i) ? COLORS[i].hover : ""}
            text-white font-bold py-6 rounded-2xl transition-all active:scale-95
            ${isDisabled(i) ? "opacity-40" : ""}
            ${isSelected(i) ? "ring-4 ring-white scale-[1.02]" : ""}
            flex items-center justify-center gap-3
          `}
        >
          <span className="text-2xl">{COLORS[i].icon}</span>
          <span className="text-base">{typeof ans === "object" ? ans.text : ans}</span>
        </button>
      ))}
      {isMultiple && Array.isArray(selected) && selected.length > 0 && (
        <button
          onClick={() => onSelect("confirm")}
          className="col-span-2 bg-white text-[#1a1a1a] font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-md"
        >
          Confirmar respuestas ({selected.length} seleccionadas)
        </button>
      )}
    </div>
  );
}