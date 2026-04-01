import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const TWO_HOURS = 2 * 60 * 60 * 1000;

const QUERIES = [
  "science",
  "history",
  "philosophy",
  "art",
  "mathematics",
  "biology",
  "psychology",
  "astronomy",
  "literature",
  "economics",
  "technology",
  "anthropology",
];

const getTimeQuery = () => {
  const slot = Math.floor(Date.now() / TWO_HOURS);
  return QUERIES[slot % QUERIES.length];
};

export default function BooksCarousel() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(getTimeQuery());
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);
  const ticking = useRef(false);

  const load = useCallback((q) => {
    setLoading(true);
    fetch(
      `https://openlibrary.org/search.json?q=${q}&limit=30&fields=key,title,author_name,cover_i,first_publish_year`
    )
      .then((r) => r.json())
      .then((data) => {
        const filtered = data.docs.filter((b) => b.cover_i).slice(0, 24);
        setBooks(filtered);
        setActive(0);
        scrollRef.current?.scrollTo({ left: 0, behavior: "instant" });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = getTimeQuery();
    setQuery(q);
    load(q);
    const interval = setInterval(() => {
      const next = getTimeQuery();
      setQuery((prev) => {
        if (next !== prev) {
          load(next);
          return next;
        }
        return prev;
      });
    }, 60_000);

    return () => clearInterval(interval);
  }, [load]);

  const onScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) { ticking.current = false; return; }
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanPrev(scrollLeft > 8);
      setCanNext(scrollLeft < scrollWidth - clientWidth - 8);
      const cardW = el.querySelector("[data-card]")?.offsetWidth || 130;
      setActive(Math.round(scrollLeft / (cardW + 16)));
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.querySelector("[data-card]")?.offsetWidth || 130;
    el.scrollBy({ left: dir * (cardW + 16) * 3, behavior: "smooth" });
  };

  const scrollTo = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.querySelector("[data-card]")?.offsetWidth || 130;
    el.scrollTo({ left: idx * (cardW + 16), behavior: "smooth" });
  };

  const categoryLabel = query.charAt(0).toUpperCase() + query.slice(1);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#f59e0b] flex items-center justify-center flex-shrink-0">
            <BookOpen size={14} color="white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="font-black text-[#1a1a1a] text-lg leading-none">
              Recomendación del día
            </h2>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            disabled={!canPrev}
            aria-label="Anterior"
            className={[
              "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-150",
              canPrev
                ? "border-[#d4d4d4] text-[#555] hover:bg-[#16a34a] hover:text-white hover:border-[#16a34a]"
                : "border-[#e8e8e8] text-[#ccc] cursor-not-allowed",
            ].join(" ")}
          >
            <ChevronLeft size={15} strokeWidth={2} />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canNext}
            aria-label="Siguiente"
            className={[
              "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-150",
              canNext
                ? "border-[#d4d4d4] text-[#555] hover:bg-[#16a34a] hover:text-white hover:border-[#16a34a]"
                : "border-[#e8e8e8] text-[#ccc] cursor-not-allowed",
            ].join(" ")}
          >
            <ChevronRight size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [scroll-snap-type:x_mandatory]"
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              data-card
              className="[scroll-snap-align:start] flex-shrink-0 w-[110px] sm:w-[130px] h-[190px] rounded-xl bg-[#f0f0f0] animate-pulse"
            />
          ))
        ) : (
          books.map((b, i) => (
            <a
              key={i}
              href={`https://openlibrary.org${b.key}`}
              target="_blank"
              rel="noopener noreferrer"
              data-card
              className="[scroll-snap-align:start] flex-shrink-0 w-[110px] sm:w-[130px] group"
            >
              <div className="h-[155px] sm:h-[175px] rounded-xl overflow-hidden bg-[#f0f0f0] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_18px_rgba(0,0,0,0.13)]">
                <img
                  src={`https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-[12px] font-bold text-[#1a1a1a] line-clamp-2 leading-tight">
                {b.title}
              </p>
              {b.author_name?.[0] && (
                <p className="text-[11px] text-[#aaa] mt-0.5 truncate">
                  {b.author_name[0]}
                </p>
              )}
              {b.first_publish_year && (
                <p className="text-[10px] text-[#ccc] mt-0.5">
                  {b.first_publish_year}
                </p>
              )}
            </a>
          ))
        )}
      </div>
    </section>
  );
}