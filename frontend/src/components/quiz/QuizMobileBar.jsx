import { useState } from "react";
import { Settings, X, Clock, List, Gamepad2 } from "lucide-react";

const TIME_OPTIONS = [
  { label: "20 s", value: 20 },
  { label: "30 s", value: 30 },
  { label: "40 s", value: 40 },
  { label: "50 s", value: 50 },
  { label: "1 min", value: 60 },
  { label: "1:30 min", value: 90 },
  { label: "2 min", value: 120 },
];

const ANSWER_OPTIONS = [
  { label: "Single select", value: "single" },
  { label: "Multiple select", value: "multiple" },
];

const MODE_OPTIONS = [
  { label: "Normal", value: "normal" },
  { label: "Presentación", value: "presentacion" },
];

function SettingRow({ icon: Icon, label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Icon size={13} className="text-[#5b4fe9]" />
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

const selectClass =
  "w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#5b4fe9]/20 focus:border-[#5b4fe9] transition-all cursor-pointer appearance-none";

export default function QuizMobileBar({
  questions, activeIndex, onSelect, onAdd, onDelete,
  timeLimit, onTimeChange,
  answerType, onAnswerTypeChange,
  mode, onModeChange,
  scheduledAt, onScheduledAtChange,
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      {settingsOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setSettingsOpen(false)}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl transition-transform duration-300 ease-out md:hidden ${
          settingsOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.12)" }}
      >
        <div className="flex flex-col items-center pt-3 pb-1">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="text-[15px] font-semibold text-gray-800">Ajustes de pregunta</span>
          <button
            onClick={() => setSettingsOpen(false)}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-5 pt-4 pb-8 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <SettingRow icon={Clock} label="Tiempo">
              <div className="relative">
                <select
                  value={timeLimit}
                  onChange={(e) => onTimeChange(Number(e.target.value))}
                  className={selectClass}
                >
                  {TIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </SettingRow>

            <SettingRow icon={List} label="Respuestas">
              <div className="relative">
                <select
                  value={answerType}
                  onChange={(e) => onAnswerTypeChange(e.target.value)}
                  className={selectClass}
                >
                  {ANSWER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </SettingRow>
          </div>

          <SettingRow icon={Gamepad2} label="Modo de juego">
            <div className="flex gap-2">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onModeChange(opt.value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    mode === opt.value
                      ? "bg-[#5b4fe9] text-white border-[#5b4fe9]"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </SettingRow>

          {mode === "normal" && (
            <SettingRow icon={Clock} label="Hora de inicio">
              <div className="relative">
                <input
                  type="datetime-local"
                  value={scheduledAt ?? ""}
                  onChange={(e) => onScheduledAtChange?.(e.target.value || null)}
                  className={`${selectClass} text-gray-600`}
                />
              </div>
              {scheduledAt ? (
                <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Se abrirá automáticamente a esa hora
                </p>
              ) : (
                <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 inline-block" />
                  Sin hora de inicio definida
                </p>
              )}
            </SettingRow>
          )}
        </div>
      </div>

      <div className="md:hidden bg-white border-t border-gray-100 relative z-30" style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#5b4fe9] text-white flex items-center justify-center"
          >
            <Settings size={17} />
          </button>

          <div className="w-px h-7 bg-gray-100 flex-shrink-0 mx-0.5" />

          <div className="flex items-center gap-1.5 overflow-x-auto flex-1 no-scrollbar">
            {questions.map((q, i) => (
              <div key={i} className="relative flex-shrink-0">
                <button
                  onClick={() => onSelect(i)}
                  className={`w-11 h-11 rounded-xl border-2 text-xs font-semibold transition-all overflow-hidden flex items-center justify-center ${
                    activeIndex === i
                      ? "border-[#5b4fe9] bg-white shadow-sm shadow-[#5b4fe9]/20"
                      : "border-gray-100 bg-gray-50 text-gray-400"
                  }`}
                >
                  {q.image ? (
                    <img src={q.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className={activeIndex === i ? "text-[#5b4fe9]" : ""}>{i + 1}</span>
                  )}
                </button>
                {questions.length > 1 && (
                  <button
                    onClick={() => onDelete(i)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-500 transition-colors"
                  >
                    <span className="text-[10px] leading-none">×</span>
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={onAdd}
              className="flex-shrink-0 w-11 h-11 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-[#5b4fe9] hover:text-[#5b4fe9] transition-all"
            >
              <span className="text-lg leading-none mb-0.5">+</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}