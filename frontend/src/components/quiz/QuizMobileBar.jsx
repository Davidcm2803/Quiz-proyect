export default function QuizMobileBar({ questions, activeIndex, onSelect, onAdd, onDelete }) {
  return (
    <div className="md:hidden bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto">
        {questions.map((q, i) => (
          <div key={i} className="relative flex-shrink-0">
            <button
              onClick={() => onSelect(i)}
              className={`w-12 h-12 rounded-xl border-2 text-xs font-semibold transition-all overflow-hidden flex items-center justify-center
                ${activeIndex === i ? "border-blue-500 bg-white shadow-md" : "border-gray-100 bg-gray-50"}`}
            >
              {q.image ? (
                <img src={q.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">{i + 1}</span>
              )}
            </button>
            {questions.length > 1 && (
              <button
                onClick={() => onDelete(i)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm"
              >
                <span className="text-[10px] leading-none">×</span>
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onAdd}
          className="flex-shrink-0 w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-all"
        >
          +
        </button>
      </div>
    </div>
  );
}