import { Clock, List } from "lucide-react";

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

function SidebarSection({ icon: Icon, title, children, inline }) {
  return (
    <div className={`flex flex-col gap-2 ${inline ? "flex-1" : ""}`}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon size={13} className="text-gray-500" />
        </div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function QuizSidebar({ timeLimit, onTimeChange, answerType, onAnswerTypeChange, inline = false }) {
  if (inline) {
    return (
      <div className="flex gap-4 w-full">
        <SidebarSection icon={Clock} title="Time limit" inline>
          <select
            value={timeLimit}
            onChange={(e) => onTimeChange(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none cursor-pointer"
          >
            {TIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </SidebarSection>

        <SidebarSection icon={List} title="Answer options" inline>
          <select
            value={answerType}
            onChange={(e) => onAnswerTypeChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none cursor-pointer"
          >
            {ANSWER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </SidebarSection>
      </div>
    );
  }

  return (
    <div className="w-56 bg-white border-l border-gray-100 flex flex-col h-full overflow-hidden p-5 gap-6 shadow-[-4px_0_12px_rgba(0,0,0,0.04)]">
      <SidebarSection icon={Clock} title="Time limit">
        <select
          value={timeLimit}
          onChange={(e) => onTimeChange(Number(e.target.value))}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all cursor-pointer"
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </SidebarSection>

      <div className="h-px bg-gray-100" />

      <SidebarSection icon={List} title="Answer options">
        <select
          value={answerType}
          onChange={(e) => onAnswerTypeChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all cursor-pointer"
        >
          {ANSWER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </SidebarSection>
    </div>
  );
}