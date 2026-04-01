import { useState, useEffect, useCallback } from "react";
import { Telescope, RefreshCw, Globe2, Satellite, ExternalLink } from "lucide-react";

const NASA_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";

async function fetchAPOD() {
  const res = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`
  );
  if (!res.ok) throw new Error("APOD failed");
  const d = await res.json();
  if (d.media_type !== "image") throw new Error("not an image today");
  return {
    url: d.url,
    hdurl: d.hdurl,
    title: d.title,
    explanation: d.explanation?.slice(0, 280) + "…",
    date: d.date,
    copyright: d.copyright,
  };
}

async function fetchFact() {
  const res = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
  const d = await res.json();
  return d.text;
}
async function fetchISS() {
  const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
  const d = await res.json();
  const { latitude, longitude, velocity, altitude } = d;
  let location = "Over the Ocean";
  try {
    const geo = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const gd = await geo.json();
    location =
      gd.address?.country ||
      gd.address?.state ||
      gd.display_name?.split(",").slice(-2).join(",").trim() ||
      "Over the Ocean";
  } catch {
  }

  return {
    lat: latitude.toFixed(2),
    lng: longitude.toFixed(2),
    velocity: Math.round(velocity).toLocaleString(),
    altitude: Math.round(altitude),
    location,
    mapsUrl: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=4`,
  };
}
async function fetchNews() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/feed/featured/${y}/${m}/${day}`
  );
  const data = await res.json();
  return (data.news || []).slice(0, 3).map((n) => ({
    story: n.story?.replace(/<[^>]+>/g, "").slice(0, 120) + "…",
    url:
      n.links?.[0]?.content_urls?.desktop?.page ||
      `https://en.wikipedia.org/wiki/${n.links?.[0]?.title}`,
  }));
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

export default function LiveFacts() {
  const [apod, setApod] = useState(null);
  const [apodLoading, setApodLoading] = useState(true);

  const [fact, setFact] = useState(null);
  const [factLoading, setFactLoading] = useState(true);

  const [iss, setIss] = useState(null);
  const [issLoading, setIssLoading] = useState(true);

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  useEffect(() => {
    const cached = sessionStorage.getItem("apod_cache");
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < 2 * 60 * 60 * 1000) {
        setApod(data);
        setApodLoading(false);
        return;
      }
    }
    fetchAPOD()
      .then((d) => {
        setApod(d);
        sessionStorage.setItem("apod_cache", JSON.stringify({ data: d, ts: Date.now() }));
      })
      .catch(console.warn)
      .finally(() => setApodLoading(false));
  }, []);
  const refreshFact = useCallback(() => {
    setFactLoading(true);
    fetchFact()
      .then(setFact)
      .catch(() => setFact("The Eiffel Tower can be 15 cm taller in summer due to thermal expansion."))
      .finally(() => setFactLoading(false));
  }, []);
  useEffect(() => { refreshFact(); }, [refreshFact]);
  useEffect(() => {
    const load = () => {
      fetchISS()
        .then(setIss)
        .catch(console.warn)
        .finally(() => setIssLoading(false));
    };
    load();
    const id = setInterval(load, 15_000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    fetchNews()
      .then(setNews)
      .catch(console.warn)
      .finally(() => setNewsLoading(false));
  }, []);

  return (
    <section className="mb-10">
      <div className="flex justify-between items-end mb-5">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Live from the Universe</h2>
          <p className="text-gray-500 text-sm">NASA · Wikipedia · ISS Tracker — updated in real time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-md relative group min-h-[220px] bg-gray-900 cursor-pointer">
          {apodLoading ? (
            <Skeleton className="absolute inset-0 rounded-2xl" />
          ) : apod ? (
            <>
              <img
                src={apod.url}
                alt={apod.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <a
                href={`https://apod.nasa.gov/apod/astropix.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                aria-label="Open NASA APOD"
              />
              <div className="absolute bottom-0 left-0 p-5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Telescope size={12} className="text-blue-300" />
                  <span className="text-[10px] font-black text-blue-300 tracking-widest uppercase">
                    NASA · Astronomy Picture of the Day
                  </span>
                </div>
                <p className="text-white font-black text-base leading-snug mb-1">{apod.title}</p>
                <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">{apod.explanation}</p>
                {apod.copyright && (
                  <p className="text-white/30 text-[10px] mt-1">© {apod.copyright}</p>
                )}
              </div>
              <a
                href="https://apod.nasa.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 w-7 h-7 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={12} color="white" />
              </a>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
              NASA APOD unavailable today
            </div>
          )}
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💡</span>
              <span className="text-xs font-black text-amber-700 tracking-widest uppercase">
                Random Fact
              </span>
            </div>
            {factLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ) : (
              <p className="text-gray-800 text-sm leading-relaxed italic">"{fact}"</p>
            )}
          </div>
          <button
            onClick={refreshFact}
            disabled={factLoading}
            className="mt-4 self-start flex items-center gap-1.5 text-amber-700 font-bold text-xs hover:text-amber-900 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={12} className={factLoading ? "animate-spin" : ""} /> New fact
          </button>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Satellite size={14} className="text-green-400" />
              <span className="text-[10px] font-black text-green-400 tracking-widest uppercase">
                ISS · Live Position
              </span>
              <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {issLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-full bg-slate-600" />
                <Skeleton className="h-3 w-3/4 bg-slate-600" />
              </div>
            ) : iss ? (
              <div className="space-y-3">
                <div>
                  <p className="text-white/40 text-[10px] uppercase font-bold mb-0.5">Currently over</p>
                  <p className="text-white font-black text-base leading-snug">{iss.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/10 rounded-lg p-2">
                    <p className="text-white/40 text-[9px] uppercase font-bold">Latitude</p>
                    <p className="text-white font-bold">{iss.lat}°</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2">
                    <p className="text-white/40 text-[9px] uppercase font-bold">Longitude</p>
                    <p className="text-white font-bold">{iss.lng}°</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2">
                    <p className="text-white/40 text-[9px] uppercase font-bold">Speed</p>
                    <p className="text-white font-bold">{iss.velocity} km/h</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2">
                    <p className="text-white/40 text-[9px] uppercase font-bold">Altitude</p>
                    <p className="text-white font-bold">{iss.altitude} km</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-white/40 text-xs">Could not load ISS position</p>
            )}
          </div>

          {iss && (
            <a
              href={iss.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-green-400 font-bold text-xs flex items-center gap-1 hover:text-green-300 transition-colors"
            >
              <Globe2 size={11} /> See on map
            </a>
          )}
        </div>
        <div className="lg:col-span-4 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📰</span>
              <span className="text-sm font-black text-gray-900">In the News Today</span>
              <span className="text-[10px] text-gray-400 font-medium">· Wikipedia</span>
            </div>
            <a
              href="https://en.wikipedia.org/wiki/Portal:Current_events"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e85d2e] text-xs font-bold flex items-center gap-1 hover:underline"
            >
              All news <ExternalLink size={11} />
            </a>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : news.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {news.map((n, i) => (
                <a
                  key={i}
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-colors group"
                >
                  <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                    {n.story}
                  </p>
                  <span className="text-[#e85d2e] text-xs font-bold mt-2 block">
                    Read more →
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No news items available today.</p>
          )}
        </div>
      </div>
    </section>
  );
}