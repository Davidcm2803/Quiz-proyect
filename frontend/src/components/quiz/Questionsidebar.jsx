import { Plus, Trash2 } from "lucide-react";

export default function QuestionSidebar({ questions, activeIndex, onSelect, onAdd, onDelete }) {
  return (
    <div className="w-52 bg-white border-r border-gray-100 flex flex-col h-full overflow-hidden shadow-[4px_0_12px_rgba(0,0,0,0.04)]">
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-0">
        {questions.map((q, i) => (
          <div
            key={i}
            onClick={() => onSelect(i)}
            className={`relative group rounded-xl border-2 cursor-pointer transition-all overflow-hidden flex flex-col w-full aspect-[4/3] flex-shrink-0
              ${activeIndex === i ? "border-blue-500 shadow-md bg-white" : "border-gray-100 hover:border-gray-200 bg-gray-50 hover:bg-white"}`}
          >
            <div className="flex items-center justify-between px-2 pt-2">
              <span className="text-[10px] text-gray-400 font-semibold">{i + 1}</span>
              {questions.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(i); }}
                  className="w-4 h-4 bg-red-500 text-white rounded-full items-center justify-center hidden group-hover:flex transition-all flex-shrink-0"
                >
                  <Trash2 size={8} />
                </button>
              )}
            </div>

            {q.image ? (
              <>
                <p className="text-[10px] text-gray-600 text-center px-2 pt-1 line-clamp-2 font-medium">
                  {q.question || <span className="text-gray-300">No question yet</span>}
                </p>
                <div className="mx-auto my-1 w-12 h-12 overflow-hidden rounded-lg flex-shrink-0">
                  <img src={q.image} alt="" className="w-full h-full object-cover" />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center px-3">
                <p className="text-[10px] text-gray-500 text-center line-clamp-3 font-medium">
                  {q.question || <span className="text-gray-300">No question yet</span>}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-95"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
}