import { Clock, List, Gamepad2 } from "lucide-react";

const TIME_OPTIONS = [
  { label: "20 seconds", value: 20 },
  { label: "30 seconds", value: 30 },
  { label: "40 seconds", value: 40 },
  { label: "50 seconds", value: 50 },
  { label: "1 minute", value: 60 },
  { label: "1 minute 30 seconds", value: 90 },
  { label: "2 minutes", value: 120 },
];

const ANSWER_OPTIONS = [
  { label: "Single select", value: "single" },
  { label: "Multiple select", value: "multiple" },
];

const MODE_OPTIONS = [
  { label: "Normal", value: "normal" },
  { label: "Presentación", value: "presentacion" },
];

const selectClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#5b4fe9]/20 focus:border-[#5b4fe9] focus:bg-white transition-all cursor-pointer appearance-none";

function SidebarSection({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-[#5b4fe9]/10 flex items-center justify-center">
          <Icon size={13} className="text-[#5b4fe9]" />
        </div>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function SelectWrapper({ children }) {
  return (
    <div className="relative">
      {children}
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

export default function QuizSidebar({
  timeLimit, onTimeChange,
  answerType, onAnswerTypeChange,
  mode, onModeChange,
  scheduledAt, onScheduledAtChange,
}) {
  return (
    <div className="w-56 bg-white border-l border-gray-100 flex flex-col h-full overflow-y-auto p-5 gap-6" style={{ boxShadow: "-4px 0 16px rgba(0,0,0,0.04)" }}>
      <SidebarSection icon={Clock} title="Time limit">
        <SelectWrapper>
          <select
            value={timeLimit}
            onChange={(e) => onTimeChange(Number(e.target.value))}
            className={selectClass}
          >
            {TIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </SelectWrapper>
      </SidebarSection>

      <div className="h-px bg-gray-100" />

      <SidebarSection icon={List} title="Answer options">
        <SelectWrapper>
          <select
            value={answerType}
            onChange={(e) => onAnswerTypeChange(e.target.value)}
            className={selectClass}
          >
            {ANSWER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </SelectWrapper>
      </SidebarSection>

      <div className="h-px bg-gray-100" />

      <SidebarSection icon={Gamepad2} title="Game mode">
        <div className="flex gap-1.5">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onModeChange(opt.value)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                mode === opt.value
                  ? "bg-[#5b4fe9] text-white border-[#5b4fe9]"
                  : "bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {mode === "normal" && (
          <div className="flex flex-col gap-2 mt-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Hora de inicio
            </span>
            <input
              type="datetime-local"
              value={scheduledAt ?? ""}
              onChange={(e) => onScheduledAtChange?.(e.target.value || null)}
              className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-600 outline-none focus:ring-2 focus:ring-[#5b4fe9]/20 focus:border-[#5b4fe9] transition-all cursor-pointer"
            />
            {scheduledAt ? (
              <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0" />
                Se abrirá automáticamente
              </p>
            ) : (
              <p className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 inline-block flex-shrink-0" />
                Sin hora definida
              </p>
            )}
          </div>
        )}
      </SidebarSection>
    </div>
  );
}