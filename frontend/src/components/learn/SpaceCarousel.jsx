import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import config from "../../config";

const TWO_HOURS = 2 * 60 * 60 * 1000;

export default function SpaceCarousel() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);
  const ticking = useRef(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${config.NASA_KEY || "DEMO_KEY"}&count=10`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(data.filter((d) => d.media_type === "image"));
          setActive(0);
          scrollRef.current?.scrollTo({ left: 0, behavior: "instant" });
        }
      })
      .catch(() => {})
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
      const cardW = el.querySelector("[data-card]")?.offsetWidth || 260;
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
    const cardW = el.querySelector("[data-card]")?.offsetWidth || 260;
    el.scrollBy({ left: dir * (cardW + 16), behavior: "smooth" });
  };

  const scrollTo = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.querySelector("[data-card]")?.offsetWidth || 260;
    el.scrollTo({ left: idx * (cardW + 16), behavior: "smooth" });
  };

  const getApodUrl = (date) =>
    date ? `https://apod.nasa.gov/apod/ap${date.replace(/-/g, "").slice(2)}.html` : "#";

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#0f172a] flex items-center justify-center flex-shrink-0">
            <Rocket size={14} color="white" />
          </div>
          <h2 className="font-black text-[#1a1a1a] text-lg leading-none">
            NASA
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
              className="[scroll-snap-align:start] flex-shrink-0 w-[calc(100vw-48px)] max-w-[260px] sm:w-[260px] h-[200px] rounded-2xl bg-[#e8f0e0] animate-pulse"
            />
          ))
        ) : images.length === 0 ? (
          <p className="text-sm text-[#888] py-6 px-2">
            No se pudieron cargar las imágenes. Verifica tu API key de NASA.
          </p>
        ) : (
          images.map((img, i) => (
            <a
              key={i}
              href={getApodUrl(img.date)}
              target="_blank"
              rel="noopener noreferrer"
              data-card
              className="[scroll-snap-align:start] flex-shrink-0 w-[calc(100vw-48px)] max-w-[260px] sm:w-[260px] h-[200px] rounded-2xl overflow-hidden relative block group"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm leading-tight line-clamp-2">
                  {img.title}
                </p>
                <p className="text-white/60 text-xs mt-1">Ver en NASA →</p>
              </div>
            </a>
          ))
        )}
      </div>
    </section>
  );
}