import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Trophy,
  Clock,
  BookOpen,
  FlaskConical,
  Globe,
  Palette,
  Rocket,
  Clapperboard,
  UtensilsCrossed,
  Music2,
  Dumbbell,
  Sparkles,
} from "lucide-react";

const QUIZZES = [
  {
    id: "history",
    color: "#b45309",
    label: "History",
    difficulty: "medium",
    questions: 24,
    mins: 8,
    sampleQ: "Which ancient wonder was located in Alexandria, Egypt?",
    sampleA: "The Lighthouse of Alexandria",
    path: "/quiz/create",
  },
  {
    id: "science",
    color: "#7c3aed",
    label: "Science & Nature",
    difficulty: "hard",
    questions: 30,
    mins: 10,
    sampleQ: "What is the most abundant gas in Earth's atmosphere?",
    sampleA: "Nitrogen (78%)",
    path: "/quiz/create",
  },
  {
    id: "geography",
    color: "#0891b2",
    label: "Geography",
    difficulty: "easy",
    questions: 20,
    mins: 6,
    sampleQ: "Which country has the most natural lakes in the world?",
    sampleA: "Canada",
    path: "/quiz/create",
  },
  {
    id: "art",
    color: "#db2777",
    label: "Arts & Literature",
    difficulty: "hard",
    questions: 18,
    mins: 7,
    sampleQ: "Who painted 'The Starry Night' in 1889?",
    sampleA: "Vincent van Gogh",
    path: "/quiz/create",
  },
  {
    id: "space",
    color: "#1d4ed8",
    label: "Space & Astronomy",
    difficulty: "medium",
    questions: 22,
    mins: 8,
    sampleQ: "How long does light from the Sun take to reach Earth?",
    sampleA: "About 8 minutes",
    path: "/quiz/create",
  },
  {
    id: "film",
    color: "#dc2626",
    label: "Film & TV",
    difficulty: "easy",
    questions: 25,
    mins: 9,
    sampleQ: "What film won the first ever Academy Award for Best Picture?",
    sampleA: "Wings (1927)",
    path: "/quiz/create",
  },
  {
    id: "food",
    color: "#d97706",
    label: "Food & Drink",
    difficulty: "easy",
    questions: 15,
    mins: 5,
    sampleQ: "Which country is the origin of the croissant?",
    sampleA: "Austria (popularised in France)",
    path: "/quiz/create",
  },
  {
    id: "music",
    color: "#e85d2e",
    label: "Music",
    difficulty: "medium",
    questions: 28,
    mins: 9,
    sampleQ: "How many strings does a standard guitar have?",
    sampleA: "Six",
    path: "/quiz/create",
  },
  {
    id: "sport",
    color: "#16a34a",
    label: "Sport & Leisure",
    difficulty: "medium",
    questions: 20,
    mins: 7,
    sampleQ: "In which year were the first modern Olympic Games held?",
    sampleA: "1896 — Athens, Greece",
    path: "/quiz/create",
  },
  {
    id: "myth",
    color: "#6d28d9",
    label: "Mythology",
    difficulty: "hard",
    questions: 16,
    mins: 6,
    sampleQ: "In Norse mythology, what is the name of the world tree?",
    sampleA: "Yggdrasil",
    path: "/quiz/create",
  },
];

const QUIZ_ICONS = {
  history: BookOpen,
  science: FlaskConical,
  geography: Globe,
  art: Palette,
  space: Rocket,
  film: Clapperboard,
  food: UtensilsCrossed,
  music: Music2,
  sport: Dumbbell,
  myth: Sparkles,
};

const DIFFICULTY_BADGE = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

const GAP = 16;

function getVisible(w) {
  if (w < 640) return 1;
  if (w < 1024) return 2;
  return 3;
}

function QuizCard({
  id,
  color,
  label,
  difficulty,
  questions,
  mins,
  sampleQ,
  sampleA,
  path,
}) {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const Icon = QUIZ_ICONS[id];

  return (
    <div
      className="relative rounded-2xl overflow-hidden h-56 cursor-pointer group shadow-md select-none"
      style={{ backgroundColor: color }}
      onClick={() => navigate(path)}
    >
      {flipped && (
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5 z-10"
          onClick={(e) => {
            e.stopPropagation();
            setFlipped(false);
          }}
        >
          <div className="text-center">
            <p className="text-white/50 text-xs mb-2 uppercase tracking-widest font-bold">
              Answer
            </p>
            <p className="text-white font-black text-lg leading-snug">
              {sampleA}
            </p>
            <p className="text-white/40 text-xs mt-3">Click to go back</p>
          </div>
        </div>
      )}

      <div className="relative p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center">
              <Icon size={20} className="text-white" />
            </div>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${DIFFICULTY_BADGE[difficulty]}`}
            >
              {difficulty.toUpperCase()}
            </span>
          </div>
          <h3 className="text-white font-black text-base leading-snug mb-2">
            {label}
          </h3>
          <p
            className="text-white/65 text-xs leading-relaxed line-clamp-2 italic cursor-pointer hover:text-white/90 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setFlipped(true);
            }}
            title="Click to reveal answer"
          >
            "{sampleQ}"
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white/50 text-[11px] font-semibold">
            <span className="flex items-center gap-1">
              <Trophy size={10} /> {questions} Qs
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} /> ~{mins} min
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(path);
            }}
            className="bg-white text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-gray-100 active:scale-95 shadow transition-all flex items-center gap-1"
          >
            <Zap size={11} /> Play
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuizCarousel() {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const obs = new ResizeObserver((e) =>
      setContainerWidth(e[0].contentRect.width),
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const visible = getVisible(containerWidth);
  const maxIndex = Math.max(0, QUIZZES.length - visible);

  useEffect(() => {
    setCurrent((c) => Math.min(c, maxIndex));
  }, [maxIndex]);

  const next = useCallback(
    () => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)),
    [maxIndex],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c <= 0 ? maxIndex : c - 1)),
    [maxIndex],
  );

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(next, 3500);
    return () => clearInterval(id);
  }, [hovered, next]);

  const cardWidth =
    containerWidth > 0 ? (containerWidth - GAP * (visible - 1)) / visible : 0;
  const offset = current * (cardWidth + GAP);

  return (
    <section className="mb-10">
      <div className="flex justify-between items-end mb-5">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Quick Quizzes</h2>
          <p className="text-gray-500 text-sm">
            Tap a question to reveal the answer. Click Play to start.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm flex-shrink-0 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={containerRef}
          className="flex-1 overflow-hidden"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            className="flex"
            style={{
              gap: GAP,
              transform: `translateX(-${offset}px)`,
              transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {QUIZZES.map((quiz) => (
              <div key={quiz.id} style={{ width: cardWidth, flexShrink: 0 }}>
                <QuizCard {...quiz} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={next}
          className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm flex-shrink-0 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
