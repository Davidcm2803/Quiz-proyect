import { useState, useRef, useEffect } from "react";
import { Clock, List, Gamepad2, ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";

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

const DAYS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

// ─── Tiny Calendar + Time Picker ──────────────────────────────────────────────
function DateTimePicker({ value, onChange }) {
  const today = new Date();
  const parsed = value ? new Date(value) : null;

  const [view, setView] = useState({
    year: parsed?.getFullYear() ?? today.getFullYear(),
    month: parsed?.getMonth() ?? today.getMonth(),
  });
  const [selectedDate, setSelectedDate] = useState(
    parsed ? { y: parsed.getFullYear(), m: parsed.getMonth(), d: parsed.getDate() } : null
  );
  const [hour, setHour] = useState(parsed ? parsed.getHours() : 8);
  const [minute, setMinute] = useState(parsed ? parsed.getMinutes() : 0);

  // Emit ISO string upward whenever selection changes
  useEffect(() => {
    if (!selectedDate) return;
    const dt = new Date(selectedDate.y, selectedDate.m, selectedDate.d, hour, minute);
    const iso = dt.toISOString().slice(0, 16);
    onChange(iso);
  }, [selectedDate, hour, minute]);

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const firstDow = new Date(view.year, view.month, 1).getDay(); // 0=Sun

  const prevMonth = () => {
    setView(v => {
      const m = v.month === 0 ? 11 : v.month - 1;
      const y = v.month === 0 ? v.year - 1 : v.year;
      return { year: y, month: m };
    });
  };
  const nextMonth = () => {
    setView(v => {
      const m = v.month === 11 ? 0 : v.month + 1;
      const y = v.month === 11 ? v.year + 1 : v.year;
      return { year: y, month: m };
    });
  };

  const isSelected = (d) =>
    selectedDate &&
    selectedDate.y === view.year &&
    selectedDate.m === view.month &&
    selectedDate.d === d;

  const isToday = (d) =>
    today.getFullYear() === view.year &&
    today.getMonth() === view.month &&
    today.getDate() === d;

  // Grid: pad with nulls for the starting weekday
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const pad = n => String(n).padStart(2, "0");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <button
          onClick={prevMonth}
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-[11px] font-bold text-gray-600 tracking-wide">
          {MONTHS[view.month]} {view.year}
        </span>
        <button
          onClick={nextMonth}
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 px-2 pb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-wider py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 px-2 pb-2 gap-y-0.5">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center">
            {d === null ? null : (
              <button
                onClick={() => setSelectedDate({ y: view.year, m: view.month, d })}
                className={`w-6 h-6 rounded-lg text-[11px] font-semibold transition-all
                  ${isSelected(d)
                    ? "bg-[#5b4fe9] text-white shadow-sm shadow-[#5b4fe9]/30"
                    : isToday(d)
                    ? "text-[#5b4fe9] ring-1 ring-[#5b4fe9]/40"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  }`}
              >
                {d}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Time picker */}
      <div className="border-t border-gray-100 px-3 py-2.5 flex items-center gap-2">
        <Clock size={12} className="text-gray-300 flex-shrink-0" />
        <div className="flex items-center gap-1 flex-1">
          {/* Hour */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setHour(h => (h + 1) % 24)}
              className="w-5 h-4 flex items-center justify-center text-gray-300 hover:text-[#5b4fe9] transition-colors"
            >
              <ChevronLeft size={10} style={{ transform: "rotate(90deg)" }} />
            </button>
            <span className="text-[13px] font-bold text-gray-700 w-6 text-center tabular-nums">{pad(hour)}</span>
            <button
              onClick={() => setHour(h => (h - 1 + 24) % 24)}
              className="w-5 h-4 flex items-center justify-center text-gray-300 hover:text-[#5b4fe9] transition-colors"
            >
              <ChevronRight size={10} style={{ transform: "rotate(90deg)" }} />
            </button>
          </div>

          <span className="text-gray-300 font-bold text-sm mb-0.5">:</span>

          {/* Minute */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setMinute(m => (m + 5) % 60)}
              className="w-5 h-4 flex items-center justify-center text-gray-300 hover:text-[#5b4fe9] transition-colors"
            >
              <ChevronLeft size={10} style={{ transform: "rotate(90deg)" }} />
            </button>
            <span className="text-[13px] font-bold text-gray-700 w-6 text-center tabular-nums">{pad(minute)}</span>
            <button
              onClick={() => setMinute(m => (m - 5 + 60) % 60)}
              className="w-5 h-4 flex items-center justify-center text-gray-300 hover:text-[#5b4fe9] transition-colors"
            >
              <ChevronRight size={10} style={{ transform: "rotate(90deg)" }} />
            </button>
          </div>

          <span className="text-[10px] text-gray-300 ml-1">hrs</span>
        </div>

        {/* Clear button */}
        {selectedDate && (
          <button
            onClick={() => { setSelectedDate(null); onChange(null); }}
            className="w-5 h-5 rounded-md bg-gray-100 hover:bg-red-50 hover:text-red-400 text-gray-300 flex items-center justify-center transition-all"
          >
            <X size={10} />
          </button>
        )}
      </div>

      {/* Status */}
      {selectedDate ? (
        <div className="px-3 pb-2.5 text-[10px] text-emerald-500 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          {DAYS[new Date(selectedDate.y, selectedDate.m, selectedDate.d).getDay()]} {selectedDate.d} {MONTHS[selectedDate.m].slice(0,3)} · {pad(hour)}:{pad(minute)}
        </div>
      ) : (
        <div className="px-3 pb-2.5 text-[10px] text-amber-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 inline-block" />
          Selecciona una fecha
        </div>
      )}
    </div>
  );
}

// ─── Shared UI primitives ──────────────────────────────────────────────────────
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

// ─── Main Sidebar ──────────────────────────────────────────────────────────────
export default function QuizSidebar({
  timeLimit = 30,
  onTimeChange,
  answerType = "single",
  onAnswerTypeChange,
  mode = "normal",
  onModeChange,
  scheduledAt,
  onScheduledAtChange,
}) {
  return (
    <div
      className="w-56 bg-white border-l border-gray-100 flex flex-col h-full overflow-y-auto p-5 gap-6"
      style={{ boxShadow: "-4px 0 16px rgba(0,0,0,0.04)" }}
    >
      <SidebarSection icon={Clock} title="Time limit">
        <SelectWrapper>
          <select
            value={timeLimit}
            onChange={(e) => onTimeChange?.(Number(e.target.value))}
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
            onChange={(e) => onAnswerTypeChange?.(e.target.value)}
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
              onClick={() => onModeChange?.(opt.value)}
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
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center gap-1.5 px-0.5">
              <CalendarDays size={11} className="text-gray-300" />
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                Hora de inicio
              </span>
            </div>
            <DateTimePicker
              value={scheduledAt}
              onChange={(val) => onScheduledAtChange?.(val)}
            />
          </div>
        )}
      </SidebarSection>
    </div>
  );
}