import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FlaskConical,
  Palette,
  Cpu,
  Languages,
  Calculator,
} from "lucide-react";
import { useCarouselQuizzes, CATEGORIES } from "../../hooks/useDailyQuizzes";

const CATEGORY_CONFIG = {
  science:          { gradient: "from-violet-800 to-violet-500", Icon: FlaskConical, label: "Ciencias"    },
  mathematics:      { gradient: "from-indigo-800 to-indigo-500", Icon: Calculator,   label: "Matemáticas" },
  history:          { gradient: "from-amber-800 to-amber-600",   Icon: BookOpen,     label: "Historia"    },
  languages:        { gradient: "from-emerald-800 to-emerald-500",Icon: Languages,   label: "Idiomas"     },
  technology:       { gradient: "from-blue-800 to-blue-500",     Icon: Cpu,          label: "Tecnología"  },
  "art-and-design": { gradient: "from-pink-800 to-pink-500",     Icon: Palette,      label: "Arte"        },
};

const GAP = 16;

function getVisible(w) {
  if (w < 640) return 1;
  if (w < 1024) return 2;
  return 3;
}

function QuizCard({ slug, quiz, navigate }) {
  const [revealed, setRevealed] = useState(false);
  const cfg = CATEGORY_CONFIG[slug] ?? { gradient: "from-gray-700 to-gray-500", Icon: BookOpen, label: slug };
  const { Icon, label, gradient } = cfg;
  const questions = quiz?.questions ?? [];
  const sampleQ = questions.length > 0
    ? questions[Math.floor(Math.random() * questions.length)]
    : null;

  if (!quiz) {
    return (
      <div
        onClick={() => navigate(`/category/${slug}`)}
        className={`rounded-3xl h-60 bg-gradient-to-br ${gradient} opacity-40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:opacity-60 transition-opacity`}
      >
        <Icon size={28} className="text-white/50" />
        <p className="text-white/40 text-xs font-semibold">{label}</p>
        <p className="text-white/30 text-[10px]">Toca para generar</p>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-3xl overflow-hidden h-60 cursor-pointer shadow-lg select-none bg-gradient-to-br ${gradient}`}
      onClick={() => navigate(`/category/${slug}`)}
    >
      {sampleQ?.image && (
        <img
          src={sampleQ.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
        />
      )}
      {revealed && sampleQ && (
        <div
          className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 gap-2"
          onClick={(e) => { e.stopPropagation(); setRevealed(false); }}
        >
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Respuesta</p>
          <p className="text-white font-black text-lg text-center leading-snug">
            {sampleQ.answers?.[Array.isArray(sampleQ.correct) ? sampleQ.correct[0] : sampleQ.correct] ?? "—"}
          </p>
          <p className="text-white/30 text-[10px] mt-2">Toca para volver</p>
        </div>
      )}
      <div className="relative z-10 p-5 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/10">
            <Icon size={18} className="text-white" />
          </div>
          <span className="bg-white/15 border border-white/10 text-white/80 text-[10px] font-bold px-2.5 py-1 rounded-full">
            {questions.length} preguntas
          </span>
        </div>
        <div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-0.5">{label}</p>
          <h3 className="text-white font-black text-base leading-tight mb-2">{quiz.title}</h3>
          {sampleQ && (
            <p
              className="text-white/50 text-xs leading-relaxed line-clamp-2 italic hover:text-white/80 transition-colors"
              onClick={(e) => { e.stopPropagation(); setRevealed((r) => !r); }}
            >
              "{sampleQ.question}"
            </p>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

export default function QuizCarousel() {
  const navigate = useNavigate();
  const { quizzes } = useCarouselQuizzes();

  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const obs = new ResizeObserver((e) => setContainerWidth(e[0].contentRect.width));
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const visible = getVisible(containerWidth);
  const maxIndex = Math.max(0, CATEGORIES.length - visible);

  useEffect(() => {
    setCurrent((c) => Math.min(c, maxIndex));
  }, [maxIndex]);

  const next = useCallback(() => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)), [maxIndex]);
  const prev = useCallback(() => setCurrent((c) => (c <= 0 ? maxIndex : c - 1)), [maxIndex]);

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [hovered, next]);

  const cardWidth = containerWidth > 0 ? (containerWidth - GAP * (visible - 1)) / visible : 0;
  const offset = current * (cardWidth + GAP);
  const cached = CATEGORIES.filter((s) => quizzes[s]).length;

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-none">Quizzes del día</h2>
          <p className="text-gray-400 text-sm mt-1">
            {cached > 0
              ? `${cached} de ${CATEGORIES.length} categorías listas · Toca una pregunta para ver la respuesta`
              : "Visita una categoría para generar su quiz"}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 pb-1">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-5 h-2 bg-gray-800" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-2xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm flex-shrink-0 transition-all active:scale-90"
        >
          <ChevronLeft size={16} className="text-gray-600" />
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
            {CATEGORIES.map((slug) => (
              <div key={slug} style={{ width: cardWidth, flexShrink: 0 }}>
                <QuizCard
                  slug={slug}
                  quiz={quizzes[slug] ?? null}
                  navigate={navigate}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={next}
          className="w-9 h-9 rounded-2xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm flex-shrink-0 transition-all active:scale-90"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>
    </section>
  );
}