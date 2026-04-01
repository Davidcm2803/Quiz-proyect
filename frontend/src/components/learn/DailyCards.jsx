import { useEffect, useState, useCallback } from "react";

const FALLBACK_QUOTES = [
  { q: "La educación es el arma más poderosa que puedes usar para cambiar el mundo.", a: "Nelson Mandela" },
  { q: "Dime y lo olvido, enséñame y lo recuerdo, involúcrame y lo aprendo.", a: "Benjamin Franklin" },
  { q: "La mente no es un vaso por llenar, sino un fuego por encender.", a: "Plutarco" },
  { q: "El aprendizaje nunca agota la mente.", a: "Leonardo da Vinci" },
  { q: "Cuanto más leo, más aprendo, más visito, más sé lo poco que sé.", a: "Voltaire" },
  { q: "La curiosidad es el motor del logro.", a: "Ken Robinson" },
  { q: "Enseñar es aprender dos veces.", a: "Joseph Joubert" },
  { q: "El conocimiento es poder.", a: "Francis Bacon" },
  { q: "La imaginación es más importante que el conocimiento.", a: "Albert Einstein" },
  { q: "No hay secreto que el tiempo no revele.", a: "Jean Racine" },
  { q: "La sabiduría es hija de la experiencia.", a: "Leonardo da Vinci" },
  { q: "Invierte en ti mismo. Tu carrera es el motor de tu riqueza.", a: "Paul Clitheroe" },
  { q: "El único modo de hacer un gran trabajo es amar lo que haces.", a: "Steve Jobs" },
  { q: "La educación no es preparación para la vida; es la vida misma.", a: "John Dewey" },
  { q: "Vive como si fueras a morir mañana. Aprende como si fueras a vivir siempre.", a: "Mahatma Gandhi" },
];

// CORS proxy URLs to try in order
const QUOTE_PROXIES = [
  "https://corsproxy.io/?url=https://zenquotes.io/api/quotes",
  "https://api.codetabs.com/v1/proxy?quest=https://zenquotes.io/api/quotes",
  "https://thingproxy.freeboard.io/fetch/https://zenquotes.io/api/quotes",
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DailyCards() {
  const [quote, setQuote] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [artLoaded, setArtLoaded] = useState(false);
  const [quotePool, setQuotePool] = useState([]);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [flipping, setFlipping] = useState(false);

  // ── Quotes ──────────────────────────────────────────────
  const applyQuote = useCallback((pool, idx) => {
    const item = pool[idx % pool.length];
    setQuote({ content: item.q, author: item.a });
  }, []);

  const useFallback = useCallback(() => {
    const pool = shuffle(FALLBACK_QUOTES);
    setQuotePool(pool);
    setQuoteIdx(0);
    applyQuote(pool, 0);
  }, [applyQuote]);

  useEffect(() => {
    let cancelled = false;

    const tryProxy = async (idx) => {
      if (idx >= QUOTE_PROXIES.length) {
        if (!cancelled) useFallback();
        return;
      }
      try {
        const r = await fetch(QUOTE_PROXIES[idx], { signal: AbortSignal.timeout(5000) });
        if (!r.ok) throw new Error("not ok");
        const data = await r.json();
        if (!Array.isArray(data) || !data[0]?.q) throw new Error("bad data");
        if (cancelled) return;
        const pool = shuffle(data.map((d) => ({ q: d.q, a: d.a })));
        setQuotePool(pool);
        setQuoteIdx(0);
        applyQuote(pool, 0);
      } catch {
        if (!cancelled) tryProxy(idx + 1);
      }
    };

    tryProxy(0);
    return () => { cancelled = true; };
  }, [applyQuote, useFallback]);

  const nextQuote = () => {
    if (flipping || quotePool.length === 0) return;
    setFlipping(true);
    setTimeout(() => {
      const next = (quoteIdx + 1) % quotePool.length;
      setQuoteIdx(next);
      applyQuote(quotePool, next);
      setFlipping(false);
    }, 200);
  };

  // ── Artwork ──────────────────────────────────────────────
  const loadAIC = useCallback(() => {
    fetch("https://api.artic.edu/api/v1/artworks/search?q=painting&fields=id,title,artist_display,image_id&limit=40")
      .then((r) => r.json())
      .then((data) => {
        const withImg = data.data.filter((a) => a.image_id);
        if (!withImg.length) return;
        const pick = withImg[Math.floor(Math.random() * withImg.length)];
        setArtwork({
          image: `https://www.artic.edu/iiif/2/${pick.image_id}/full/400,/0/default.jpg`,
          title: pick.title,
          artist: pick.artist_display?.split("\n")[0] || "Artista desconocido",
          url: `https://www.artic.edu/artworks/${pick.id}`,
          source: "Art Institute",
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const useMet = Math.random() > 0.5;
    if (useMet) {
      fetch("https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=painting&departmentId=11")
        .then((r) => r.json())
        .then((data) => {
          const ids = data.objectIDs?.slice(0, 60) || [];
          const pick = ids[Math.floor(Math.random() * ids.length)];
          return fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${pick}`);
        })
        .then((r) => r.json())
        .then((obj) => {
          if (obj.primaryImageSmall) {
            setArtwork({
              image: obj.primaryImageSmall,
              title: obj.title,
              artist: obj.artistDisplayName || "Artista desconocido",
              url: `https://www.metmuseum.org/art/collection/search/${obj.objectID}`,
              source: "The Met",
            });
          } else throw new Error("no image");
        })
        .catch(() => loadAIC());
    } else {
      loadAIC();
    }
  }, [loadAIC]);

  return (
    <section>
      <h2 className="font-black text-[#1a1a1a] text-lg mb-4">
        Contenido del Día
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative rounded-2xl bg-[#1a1a1a] flex flex-col justify-between min-h-[190px] p-5 overflow-hidden">
          <div className="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center flex-shrink-0 mb-3">
            <span className="text-white text-[11px] font-bold leading-none select-none">"</span>
          </div>

          <div
            className="flex-1 flex flex-col gap-2"
            style={{ opacity: flipping ? 0 : 1, transition: "opacity 0.2s ease" }}
          >
            {quote ? (
              <>
                <p className="text-white text-sm font-medium leading-relaxed mt-1">
                  "{quote.content}"
                </p>
                <p className="text-[#888] text-xs">— {quote.author}</p>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-1">
                <div className="h-3 rounded bg-white/10 animate-pulse" />
                <div className="h-3 rounded bg-white/10 animate-pulse w-4/5" />
                <div className="h-3 rounded bg-white/10 animate-pulse w-3/5" />
                <div className="h-2 rounded bg-white/10 animate-pulse w-2/5 mt-1" />
              </div>
            )}
          </div>

          <button
            onClick={nextQuote}
            disabled={flipping}
            className="self-end mt-4 text-[11px] font-medium text-[#888] bg-white/5 border border-white/10 rounded-full px-3 py-1 transition-all duration-150 hover:bg-[#16a34a] hover:text-white hover:border-[#16a34a] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            siguiente →
          </button>
        </div>
        <a
          href={artwork?.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="relative rounded-2xl overflow-hidden min-h-[190px] bg-[#e8f0e0] block group"
        >
          {artwork ? (
            <>
              {!artLoaded && (
                <div className="absolute inset-0 bg-[#e0e8d8] animate-pulse" />
              )}
              <img
                src={artwork.image}
                alt={artwork.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                style={{ opacity: artLoaded ? 1 : 0, transition: "opacity 0.4s ease, transform 0.3s ease" }}
                onLoad={() => setArtLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 pb-3.5">
                <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-2.5 py-0.5 mb-1.5">
                  <span className="w-[5px] h-[5px] rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-[10px] font-semibold text-white/85 uppercase tracking-wide">
                    Arte del día · {artwork.source}
                  </span>
                </div>
                <p className="text-white font-bold text-[13px] leading-snug line-clamp-2 mb-0.5">
                  {artwork.title}
                </p>
                <p className="text-white/55 text-[11px] truncate">
                  {artwork.artist}
                </p>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 animate-pulse bg-[#e0e8d8]" />
          )}
        </a>
      </div>
    </section>
  );
}