import { useState, useEffect } from "react";
import { ExternalLink, Bookmark, Share2, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Wikipedia REST API — 100% public, no key ───────────────────────────────
async function fetchWikiFeatured() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/feed/featured/${y}/${m}/${day}`
  );
  if (!res.ok) throw new Error("wiki failed");
  return res.json();
}

function articleFromWiki(data) {
  const list = [];

  if (data?.tfa) {
    const t = data.tfa;
    list.push({
      tag: "TODAY'S FEATURED ARTICLE",
      title: t.titles?.normalized || t.title,
      description: (t.extract || "").slice(0, 220) + "…",
      image:
        t.originalimage?.source ||
        t.thumbnail?.source ||
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80",
      url: t.content_urls?.desktop?.page || "#",
      meta: "Wikipedia · Featured",
    });
  }

  if (data?.onthisday?.length) {
    const ev = data.onthisday[0];
    const pg = ev.pages?.[0];
    list.push({
      tag: `ON THIS DAY — ${new Date().toLocaleDateString("en", { month: "long", day: "numeric" })}`,
      title: pg?.titles?.normalized || ev.text?.slice(0, 80) + "…",
      description: ev.text?.slice(0, 220) + "…",
      image:
        pg?.originalimage?.source ||
        pg?.thumbnail?.source ||
        "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80",
      url: pg?.content_urls?.desktop?.page || "#",
      meta: `${ev.year} · History`,
    });
  }

  if (data?.mostread?.articles?.length) {
    const mr = data.mostread.articles[0];
    list.push({
      tag: "MOST READ TODAY",
      title: mr.titles?.normalized || mr.title,
      description: (mr.extract || "").slice(0, 220) + "…",
      image:
        mr.originalimage?.source ||
        mr.thumbnail?.source ||
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80",
      url: mr.content_urls?.desktop?.page || "#",
      meta: `${mr.views?.toLocaleString()} views today`,
    });
  }

  return list;
}

function recentFromWiki(data) {
  if (!data?.onthisday) return [];
  return data.onthisday.slice(1, 4).map((ev) => {
    const pg = ev.pages?.[0];
    return {
      title: pg?.titles?.normalized || ev.text?.slice(0, 70) + "…",
      desc: ev.text?.slice(0, 130) + "…",
      image:
        pg?.thumbnail?.source ||
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&q=80",
      url: pg?.content_urls?.desktop?.page || "#",
      year: ev.year,
    };
  });
}

export default function DiscoverHero() {
  const [articles, setArticles] = useState([]);
  const [recent, setRecent] = useState([]);
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState({});

  useEffect(() => {
    fetchWikiFeatured()
      .then((d) => {
        setArticles(articleFromWiki(d));
        setRecent(recentFromWiki(d));
      })
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, []);


  useEffect(() => {
    if (articles.length < 2) return;
    const id = setInterval(() => slide(1), 8000);
    return () => clearInterval(id);
  }, [articles]);

  function slide(dir) {
    setFade(false);
    setTimeout(() => {
      setIdx((i) => (i + dir + articles.length) % articles.length);
      setFade(true);
    }, 250);
  }

  const art = articles[idx];

  return (
    <div className="grid grid-cols-12 gap-6 mb-10">
      <div
        className="col-span-12 lg:col-span-8 relative h-[420px] rounded-2xl overflow-hidden shadow-xl cursor-pointer"
        style={{ transition: "opacity 0.25s", opacity: fade ? 1 : 0 }}
        onClick={() => art?.url && window.open(art.url, "_blank")}
      >
        {loading || !art ? (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        ) : (
          <>
            <img
              src={art.image}
              alt={art.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

    
            {articles.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); slide(-1); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft size={18} color="white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); slide(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center backdrop-blur-sm transition-colors"
                >
                  <ChevronRight size={18} color="white" />
                </button>
              </>
            )}
            <div className="absolute bottom-0 left-0 p-8 max-w-xl">
              <span className="inline-block bg-[#e85d2e] text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest mb-3">
                {art.tag}
              </span>
              <h1 className="text-3xl font-black text-white mb-3 leading-tight line-clamp-3">
                {art.title}
              </h1>
              <p className="text-white/75 text-sm leading-relaxed mb-5 line-clamp-3">
                {art.description}
              </p>
              <div className="flex items-center gap-3">
                <button
                  className="bg-white text-gray-900 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-100 active:scale-95 transition-all shadow-md"
                  onClick={(e) => { e.stopPropagation(); window.open(art.url, "_blank"); }}
                >
                  Read on Wikipedia <ExternalLink size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSaved((s) => ({ ...s, [idx]: !s[idx] }));
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    saved[idx] ? "bg-[#e85d2e]" : "bg-white/20 hover:bg-white/35"
                  }`}
                  title="Save"
                >
                  <Bookmark size={15} color="white" fill={saved[idx] ? "white" : "none"} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard?.writeText(art.url).catch(() => {});
                  }}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition-colors"
                  title="Copy link"
                >
                  <Share2 size={15} color="white" />
                </button>
              </div>
              <p className="text-white/40 text-[10px] mt-3">{art.meta}</p>
            </div>
          </>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
        <h3 className="text-lg font-black text-gray-900">On This Day in History</h3>

        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-xl bg-white animate-pulse h-24 border border-gray-100"
              />
            ))
          : recent.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 p-3 rounded-xl bg-white hover:bg-orange-50 transition-colors group shadow-sm border border-gray-100"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&q=80";
                  }}
                />
                <div className="overflow-hidden">
                  <span className="text-[10px] font-bold text-[#e85d2e] tracking-widest">
                    {item.year}
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm mb-1 leading-snug group-hover:text-[#e85d2e] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>
                </div>
              </a>
            ))}

        <div className="mt-auto p-5 rounded-xl bg-amber-50 border border-amber-200 text-center">
          <span className="text-2xl mb-2 block">💡</span>
          <h4 className="font-bold text-amber-900 text-sm mb-1">Did You Know?</h4>
          <p className="text-xs text-amber-800 italic leading-relaxed">
            Wikipedia has over <strong>6.7 million articles</strong> in English — updated by volunteers every single day.
          </p>
        </div>
      </div>
    </div>
  );
}