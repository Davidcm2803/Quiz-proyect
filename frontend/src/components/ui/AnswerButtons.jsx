const COLORS = [
  { bg: "bg-[#e8678f]", hover: "hover:bg-[#df4071]", icon: "▲" },
  { bg: "bg-[#00b64f]", hover: "hover:bg-[#009641]", icon: "◆" },
  { bg: "bg-[#3d98d6]", hover: "hover:bg-[#2276af]", icon: "●" },
  { bg: "bg-[#f93d3a]", hover: "hover:bg-[#f93d3a]", icon: "■" },
];

export default function AnswerButtons({ answers, selected, onSelect, answerType }) {
  const isMultiple = answerType === "multiple";

  const isSelected = (i) =>
    isMultiple ? Array.isArray(selected) && selected.includes(i) : selected === i;

  const isDisabled = (i) =>
    !isMultiple && selected !== null && selected !== i;

  return (
    <div className="flex flex-col gap-2 sm:gap-3 w-full">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
        {answers.map((ans, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={!isMultiple && selected !== null}
            className={`
              ${COLORS[i].bg} ${!isSelected(i) ? COLORS[i].hover : ""}
              text-white font-bold
              py-18 sm:py-9 lg:py-11
              rounded-xl sm:rounded-2xl
              transition-all active:scale-95
              ${isDisabled(i) ? "opacity-40" : ""}
              ${isSelected(i) ? "ring-4 ring-white scale-[1.02]" : ""}
              flex items-center justify-center gap-2 sm:gap-3 shadow-lg
            `}
          >
            <span className="text-lg sm:text-xl lg:text-2xl">{COLORS[i].icon}</span>
            <span className="text-sm sm:text-base lg:text-lg leading-tight text-center">
              {typeof ans === "object" ? ans.text : ans}
            </span>
          </button>
        ))}
      </div>
      {isMultiple && Array.isArray(selected) && selected.length > 0 && (
        <button
          onClick={() => onSelect("confirm")}
          className="w-full bg-white text-[#1a1a1a] font-bold py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl transition-all active:scale-95 shadow-md text-sm sm:text-base lg:text-lg"
        >
          Confirmar respuestas ({selected.length} seleccionadas)
        </button>
      )}
    </div>
  );
}