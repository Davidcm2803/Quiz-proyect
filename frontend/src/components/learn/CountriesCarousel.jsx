import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";

export default function CountriesCarousel() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);
  const ticking = useRef(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital")
      .then((r) => r.json())
      .then((data) =>
        setCountries(data.sort(() => 0.5 - Math.random()).slice(0, 14))
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) { ticking.current = false; return; }
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanPrev(scrollLeft > 8);
      setCanNext(scrollLeft < scrollWidth - clientWidth - 8);
      const cardW = el.querySelector("[data-card]")?.offsetWidth || 180;
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
    const cardW = el.querySelector("[data-card]")?.offsetWidth || 180;
    el.scrollBy({ left: dir * (cardW + 16), behavior: "smooth" });
  };

  const scrollTo = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.querySelector("[data-card]")?.offsetWidth || 180;
    el.scrollTo({ left: idx * (cardW + 16), behavior: "smooth" });
  };

  const formatPop = (n) => {
    if (!n) return null;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M hab.`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K hab.`;
    return `${n} hab.`;
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#0ea5e9] flex items-center justify-center flex-shrink-0">
            <Globe size={14} color="white" strokeWidth={2} />
          </div>
          <h2 className="font-black text-[#1a1a1a] text-lg leading-none">
            Explora países
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
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                data-card
                className="[scroll-snap-align:start] flex-shrink-0 w-[calc(100vw-48px)] max-w-[180px] sm:w-[180px] h-[160px] rounded-2xl bg-[#f0f0f0] animate-pulse"
              />
            ))
          : countries.map((c, i) => (
              <a
                key={i}
                href={`https://es.wikipedia.org/wiki/${encodeURIComponent(c.name.common)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-card
                className="[scroll-snap-align:start] flex-shrink-0 w-[calc(100vw-48px)] max-w-[180px] sm:w-[180px] rounded-2xl bg-white border border-[#ebebeb] flex flex-col overflow-hidden group transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d0d0d0] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)]"
              >
                <div className="w-full h-[90px] overflow-hidden flex-shrink-0 bg-[#f5f5f5]">
                  <img
                    src={c.flags?.svg}
                    alt={c.name.common}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 p-3 gap-1">
                  <div>
                    <p className="font-bold text-[#1a1a1a] text-[13px] leading-tight truncate">
                      {c.name.common}
                    </p>
                    <p className="text-[11px] text-[#aaa] mt-0.5 truncate">
                      {c.capital?.[0] ?? c.region}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {c.population ? (
                      <span className="text-[10.5px] text-[#bbb]">
                        {formatPop(c.population)}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[11px] font-semibold text-[#16a34a]">
                      Ver →
                    </span>
                  </div>
                </div>
              </a>
            ))}
      </div>
    </section>
  );
}