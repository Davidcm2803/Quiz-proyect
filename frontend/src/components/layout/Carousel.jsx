import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Sparkles,
  FileText,
  LayoutGrid,
  Lightbulb,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Button from "../ui/Button";
import CarouselArrow from "../ui/CarouselArrow";

const TOOLS = [
  {
    id: 1,
    bgColor: "#ef4444",
    icon: <Plus size={22} strokeWidth={2.5} color="white" />,
    title: "Create content from scratch",
    buttonLabel: "Create",
    path: "/quiz/create",
  },
  {
    id: 2,
    bgColor: "#16a34a",
    icon: <Sparkles size={22} strokeWidth={2} color="white" />,
    title: "Save time! Create kahoots with AI",
    buttonLabel: "Start creating",
    path: "/quiz/ai",
  },
  {
    id: 3,
    bgColor: "#db2777",
    icon: <FileText size={22} strokeWidth={2} color="white" />,
    title: "Generate a kahoot from your PDF file in one click",
    buttonLabel: "Create",
    path: "/quiz/pdf", 
  },
  {
    id: 4,
    bgColor: "#7c3aed",
    icon: <LayoutGrid size={22} strokeWidth={2} color="white" />,
    title: "Organize your content with smart layouts",
    buttonLabel: "Explore",
    path: null,
  },
  {
    id: 5,
    bgColor: "#0891b2",
    icon: <Lightbulb size={22} strokeWidth={2} color="white" />,
    title: "Get inspired with ready-made templates",
    buttonLabel: "Browse",
    path: null,
  },
  {
    id: 6,
    bgColor: "#ea580c",
    icon: <BookOpen size={22} strokeWidth={2} color="white" />,
    title: "Learn best practices from our guide library",
    buttonLabel: "Read",
    path: null,
  },
];

function ToolCard({ bgColor, icon, title, buttonLabel, path }) {
  const navigate = useNavigate();

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="rounded-xl p-4 h-40 flex flex-col justify-between shadow-md w-full cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div
          className="rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
        >
          {icon}
        </div>
        <p className="text-white font-semibold text-m leading-snug">{title}</p>
      </div>

      <div className="flex justify-end">
        <Button
          variant="secondary"
          size="m"
          className="rounded-full px-6 py-2 text-base shadow-md hover:shadow-lg"
          onClick={() => path && navigate(path)}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}

const GAP = 20;

function getVisible(width) {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
}

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef(null);
  const total = TOOLS.length;
  const visible = getVisible(containerWidth);
  const maxIndex = Math.max(0, total - visible);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setCurrent((c) => Math.min(c, maxIndex));
  }, [maxIndex]);

  const next = useCallback(
    () => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)),
    [maxIndex]
  );

  const prev = useCallback(
    () => setCurrent((c) => (c <= 0 ? maxIndex : c - 1)),
    [maxIndex]
  );

  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(next, 3000);
    return () => clearInterval(id);
  }, [isHovered, next]);

  const cardWidth =
    containerWidth > 0
      ? (containerWidth - GAP * (visible - 1)) / visible
      : 0;

  const offset = current * (cardWidth + GAP);

  return (
    <section className="py-6 w-full relative">
      <h2 className="text-2xl font-black text-gray-900 mb-4 text-left ml-14">
        Quick tools to get started
      </h2>

      <div className="flex items-center gap-4 mb-0">
        <CarouselArrow onClick={prev}>
          <ChevronLeft size={18} strokeWidth={2.5} />
        </CarouselArrow>

        <div
          ref={containerRef}
          className="flex-1 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex"
            style={{
              gap: GAP,
              transform: `translateX(-${offset}px)`,
              transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {TOOLS.map((tool) => (
              <div key={tool.id} style={{ width: cardWidth, flexShrink: 0 }}>
                <ToolCard {...tool} />
              </div>
            ))}
          </div>
        </div>

        <CarouselArrow onClick={next}>
          <ChevronRight size={18} strokeWidth={2.5} />
        </CarouselArrow>
      </div>
    </section>
  );
}