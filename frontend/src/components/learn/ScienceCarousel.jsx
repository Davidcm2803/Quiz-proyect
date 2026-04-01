import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, FlaskConical } from "lucide-react";

const TWO_HOURS = 2 * 60 * 60 * 1000;

export default function ScienceCarousel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);
  const ticking = useRef(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=12")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setArticles(data.results);
        setActive(0);
        scrollRef.current?.scrollTo({ left: 0, behavior: "instant" });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, TWO_HOURS);
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
      const cardW = el.querySelector("[data-card]")?.offsetWidth || 240;
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
    const cardW = el.querySelector("[data-card]")?.offsetWidth || 240;
    el.scrollBy({ left: dir * (cardW + 16), behavior: "smooth" });
  };

  const scrollTo = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.querySelector("[data-card]")?.offsetWidth || 240;
    el.scrollTo({ left: idx * (cardW + 16), behavior: "smooth" });
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("es", { day: "numeric", month: "short" });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#7c3aed] flex items-center justify-center flex-shrink-0">
            <FlaskConical size={14} color="white" strokeWidth={2} />
          </div>
          <h2 className="font-black text-[#1a1a1a] text-lg leading-none">
            Ciencia & Tecnología
          </h2>
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
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              data-card
              className="[scroll-snap-align:start] flex-shrink-0 w-[calc(100vw-48px)] max-w-[240px] sm:w-[240px] h-[200px] rounded-2xl bg-[#f0f0f0] animate-pulse"
            />
          ))
        ) : error ? (
          <p className="text-sm text-[#888] py-6 px-2">
            Error cargando artículos. Intenta de nuevo más tarde.
          </p>
        ) : (
          articles.map((a, i) => (
            <a
              key={i}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              data-card
              className="[scroll-snap-align:start] flex-shrink-0 w-[calc(100vw-48px)] max-w-[240px] sm:w-[240px] rounded-2xl bg-white border border-[#ebebeb] flex flex-col overflow-hidden group transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d0d0d0] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)]"
            >
              <div className="relative w-full h-[108px] bg-[#f5f5f5] flex-shrink-0 overflow-hidden">
                {a.image_url ? (
                  <img
                    src={a.image_url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FlaskConical size={28} className="text-[#d0d0d0]" />
                  </div>
                )}
                {a.news_site && (
                  <span className="absolute top-2 left-2 bg-white/90 text-[#555] text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight max-w-[120px] truncate">
                    {a.news_site}
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-between flex-1 p-3 gap-2">
                <p className="font-bold text-[13px] leading-[1.35] line-clamp-2 text-[#1a1a1a]">
                  {a.title}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  {a.published_at && (
                    <span className="text-[11px] text-[#aaa]">
                      {formatDate(a.published_at)}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-[#16a34a] ml-auto">
                    Leer →
                  </span>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </section>
  );
}