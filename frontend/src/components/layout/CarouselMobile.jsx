import { useNavigate } from "react-router-dom";
import {
  Plus,
  Sparkles,
  FileText,
  LayoutGrid,
  Lightbulb,
  BookOpen,
} from "lucide-react";

const TOOLS = [
  {
    id: 1,
    bgColor: "#e8678f",
    icon: <Plus size={20} strokeWidth={2.5} color="white" />,
    title: "Create content from scratch",
    buttonLabel: "Create",
    path: "/quiz/create",
  },
  {
    id: 2,
    bgColor: "#00b64f",
    icon: <Sparkles size={20} strokeWidth={2} color="white" />,
    title: "Save time! Create kahoots with AI",
    buttonLabel: "Start",
    path: "/quiz/ai",
  },
  {
    id: 3,
    bgColor: "#f93d3a",
    icon: <FileText size={20} strokeWidth={2} color="white" />,
    title: "Generate a kahoot from your PDF",
    buttonLabel: "Create",
    path: "/quiz/pdf",
  },
  {
    id: 4,
    bgColor: "#f6d636",
    icon: <LayoutGrid size={20} strokeWidth={2} color="white" />,
    title: "Organize with smart layouts",
    buttonLabel: "Explore",
    path: null,
  },
  {
    id: 5,
    bgColor: "#e8678f",
    icon: <Lightbulb size={20} strokeWidth={2} color="white" />,
    title: "Get inspired with templates",
    buttonLabel: "Browse",
    path: null,
  },
  {
    id: 6,
    bgColor: "#3d98d6",
    icon: <BookOpen size={20} strokeWidth={2} color="white" />,
    title: "Learn from our guide library",
    buttonLabel: "Read",
    path: null,
  },
];

function MobileToolCard({ bgColor, icon, title, buttonLabel, path }) {
  const navigate = useNavigate();

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="rounded-2xl p-3 flex flex-col justify-between shadow-md w-full h-full active:scale-95 transition-transform duration-150"
    >
      <div className="flex flex-col gap-2">
        <div
          className="rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.28)" }}
        >
          {icon}
        </div>
        <p className="text-white font-semibold text-sm leading-snug line-clamp-3">
          {title}
        </p>
      </div>

      <div className="flex justify-end mt-3">
        <button
          onClick={() => path && navigate(path)}
          className="bg-white text-gray-800 font-semibold text-xs rounded-full px-4 py-1.5 shadow hover:shadow-md active:scale-95 transition-all duration-150 whitespace-nowrap"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default function CarouselMobile() {
  return (
    // "block" por defecto, "hidden" en lg+
    <section className="lg:hidden px-4 py-5 w-full">
      <h2 className="text-xl font-black text-gray-900 mb-3">
        Quick tools to get started
      </h2>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        style={{ gridAutoRows: "140px" }}
      >
        {TOOLS.map((tool) => (
          <MobileToolCard key={tool.id} {...tool} />
        ))}
      </div>
    </section>
  );
}