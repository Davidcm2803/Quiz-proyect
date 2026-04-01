import { useState, useMemo } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

const ALL_WONDERS = [
  { id: 1, region: "EUROPE", name: "The Parthenon", wikiTitle: "Parthenon", mapsUrl: "https://www.openstreetmap.org/?mlat=37.9715&mlon=23.7267&zoom=15", emoji: "🏛️", fallbackDesc: "An ancient temple on the Athenian Acropolis, dedicated to the goddess Athena, built in 447 BC." },
  { id: 2, region: "ASIA", name: "Great Wall of China", wikiTitle: "Great_Wall_of_China", mapsUrl: "https://www.openstreetmap.org/?mlat=40.4319&mlon=116.5704&zoom=13", emoji: "🧱", fallbackDesc: "A series of fortifications stretching over 13,000 miles across northern China." },
  { id: 3, region: "AFRICA", name: "Pyramids of Giza", wikiTitle: "Egyptian_pyramids", mapsUrl: "https://www.openstreetmap.org/?mlat=29.9792&mlon=31.1342&zoom=14", emoji: "🔺", fallbackDesc: "The last remaining of the Seven Wonders of the Ancient World, built around 2560 BCE." },
  { id: 4, region: "AMERICAS", name: "Machu Picchu", wikiTitle: "Machu_Picchu", mapsUrl: "https://www.openstreetmap.org/?mlat=-13.1631&mlon=-72.5450&zoom=14", emoji: "🏔️", fallbackDesc: "A 15th-century Inca citadel set high in the Andes of Peru." },
  { id: 5, region: "OCEANIA", name: "Great Barrier Reef", wikiTitle: "Great_Barrier_Reef", mapsUrl: "https://www.openstreetmap.org/?mlat=-18.2871&mlon=147.6992&zoom=8", emoji: "🐠", fallbackDesc: "The world's largest coral reef system off the coast of Queensland, Australia." },
  { id: 6, region: "EUROPE", name: "Colosseum", wikiTitle: "Colosseum", mapsUrl: "https://www.openstreetmap.org/?mlat=41.8902&mlon=12.4922&zoom=15", emoji: "🏟️", fallbackDesc: "An ancient amphitheatre in Rome, built in 70–80 AD, the largest ever constructed." },
  { id: 7, region: "ASIA", name: "Taj Mahal", wikiTitle: "Taj_Mahal", mapsUrl: "https://www.openstreetmap.org/?mlat=27.1751&mlon=78.0421&zoom=15", emoji: "🕌", fallbackDesc: "An ivory-white marble mausoleum in Agra, India, commissioned in 1632 by Mughal emperor Shah Jahan." },
  { id: 8, region: "AMERICAS", name: "Chichen Itza", wikiTitle: "Chichen_Itza", mapsUrl: "https://www.openstreetmap.org/?mlat=20.6843&mlon=-88.5678&zoom=14", emoji: "🗿", fallbackDesc: "A large pre-Columbian city built by the Maya civilisation in Mexico." },
  { id: 9, region: "EUROPE", name: "Stonehenge", wikiTitle: "Stonehenge", mapsUrl: "https://www.openstreetmap.org/?mlat=51.1789&mlon=-1.8262&zoom=14", emoji: "🪨", fallbackDesc: "A prehistoric monument in Wiltshire, England, dating to 3000–2000 BCE." },
  { id: 10, region: "ASIA", name: "Angkor Wat", wikiTitle: "Angkor_Wat", mapsUrl: "https://www.openstreetmap.org/?mlat=13.4125&mlon=103.8670&zoom=14", emoji: "⛩️", fallbackDesc: "A temple complex in Cambodia, the largest religious monument in the world." },
  { id: 11, region: "AMERICAS", name: "Statue of Liberty", wikiTitle: "Statue_of_Liberty", mapsUrl: "https://www.openstreetmap.org/?mlat=40.6892&mlon=-74.0445&zoom=15", emoji: "🗽", fallbackDesc: "A colossal neoclassical sculpture on Liberty Island in New York Harbor, gifted by France in 1886." },
  { id: 12, region: "AFRICA", name: "Victoria Falls", wikiTitle: "Victoria_Falls", mapsUrl: "https://www.openstreetmap.org/?mlat=-17.9243&mlon=25.8572&zoom=13", emoji: "💧", fallbackDesc: "One of the world's largest waterfalls, on the border of Zambia and Zimbabwe." },
  { id: 13, region: "ASIA", name: "Mount Fuji", wikiTitle: "Mount_Fuji", mapsUrl: "https://www.openstreetmap.org/?mlat=35.3606&mlon=138.7274&zoom=12", emoji: "🗻", fallbackDesc: "Japan's highest mountain at 3,776 m, an active stratovolcano and sacred site." },
  { id: 14, region: "EUROPE", name: "Eiffel Tower", wikiTitle: "Eiffel_Tower", mapsUrl: "https://www.openstreetmap.org/?mlat=48.8584&mlon=2.2945&zoom=15", emoji: "🗼", fallbackDesc: "A wrought-iron lattice tower in Paris, built in 1889 for the World's Fair." },
  { id: 15, region: "AMERICAS", name: "Amazon Rainforest", wikiTitle: "Amazon_rainforest", mapsUrl: "https://www.openstreetmap.org/?mlat=-3.4653&mlon=-62.2159&zoom=6", emoji: "🌿", fallbackDesc: "The world's largest tropical rainforest, covering most of the Amazon basin." },
  { id: 16, region: "ASIA", name: "Petra", wikiTitle: "Petra", mapsUrl: "https://www.openstreetmap.org/?mlat=30.3285&mlon=35.4444&zoom=14", emoji: "🏜️", fallbackDesc: "A historical city in Jordan, known for its rock-cut architecture." },
  { id: 17, region: "AFRICA", name: "Serengeti", wikiTitle: "Serengeti", mapsUrl: "https://www.openstreetmap.org/?mlat=-2.3333&mlon=34.8333&zoom=8", emoji: "🦁", fallbackDesc: "A vast ecosystem in Tanzania famous for the annual wildebeest migration." },
  { id: 18, region: "OCEANIA", name: "Uluru", wikiTitle: "Uluru", mapsUrl: "https://www.openstreetmap.org/?mlat=-25.3444&mlon=131.0369&zoom=12", emoji: "🪨", fallbackDesc: "A large sandstone rock formation in the Northern Territory of Australia, sacred to the Anangu people." },
  { id: 19, region: "AMERICAS", name: "Grand Canyon", wikiTitle: "Grand_Canyon", mapsUrl: "https://www.openstreetmap.org/?mlat=36.1069&mlon=-112.1129&zoom=11", emoji: "🏞️", fallbackDesc: "A steep-sided canyon carved by the Colorado River in Arizona, up to 1,857 m deep." },
  { id: 20, region: "ASIA", name: "Borobudur", wikiTitle: "Borobudur", mapsUrl: "https://www.openstreetmap.org/?mlat=-7.6079&mlon=110.2038&zoom=14", emoji: "🛕", fallbackDesc: "A 9th-century Buddhist temple in Central Java, Indonesia, the world's largest Buddhist temple." },
  { id: 21, region: "EUROPE", name: "Sagrada Família", wikiTitle: "Sagrada_Família", mapsUrl: "https://www.openstreetmap.org/?mlat=41.4036&mlon=2.1744&zoom=15", emoji: "⛪", fallbackDesc: "A large unfinished Roman Catholic basilica in Barcelona, designed by Antoni Gaudí." },
  { id: 22, region: "AMERICAS", name: "Easter Island", wikiTitle: "Easter_Island", mapsUrl: "https://www.openstreetmap.org/?mlat=-27.1127&mlon=-109.3497&zoom=11", emoji: "🗿", fallbackDesc: "A Chilean island famous for its 900 monumental statues called moai, created by the Rapa Nui people." },
  { id: 23, region: "ASIA", name: "Hagia Sophia", wikiTitle: "Hagia_Sophia", mapsUrl: "https://www.openstreetmap.org/?mlat=41.0086&mlon=28.9802&zoom=15", emoji: "🕌", fallbackDesc: "A Late Antique place of worship in Istanbul, built in 537 AD, now a mosque." },
  { id: 24, region: "AFRICA", name: "Great Mosque of Djenné", wikiTitle: "Great_Mosque_of_Djenné", mapsUrl: "https://www.openstreetmap.org/?mlat=13.9063&mlon=-4.5551&zoom=15", emoji: "🕌", fallbackDesc: "The largest mud brick building in the world, located in Mali." },
  { id: 25, region: "EUROPE", name: "Acropolis of Athens", wikiTitle: "Acropolis_of_Athens", mapsUrl: "https://www.openstreetmap.org/?mlat=37.9715&mlon=23.7267&zoom=15", emoji: "🏺", fallbackDesc: "An ancient citadel on a rocky outcrop above Athens containing several ancient buildings." },
];

const COLORS = ["#e85d2e","#16a34a","#d97706","#7c3aed","#0891b2","#dc2626","#db2777","#059669","#b45309","#6d28d9"];

const POSITIONS = [
  { top: "28%", left: "45%" },
  { top: "30%", left: "73%" },
  { top: "35%", left: "50%" },
  { top: "37%", left: "16%" },
  { top: "42%", left: "67%" },
  { top: "43%", left: "53%" },
  { top: "48%", left: "20%" },
  { top: "50%", left: "76%" },
  { top: "62%", left: "26%" },
  { top: "67%", left: "83%" },
];

function pickRandom(arr, count) {
  return [...arr]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((w, i) => ({ ...w, color: COLORS[i % COLORS.length], ...POSITIONS[i] }));
}

async function fetchWikiSummary(title) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  );
  if (!res.ok) throw new Error("not found");
  return res.json();
}

export default function InteractiveMap() {
  const [active, setActive] = useState(null);
  const [summaries, setSummaries] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const wonders = useMemo(() => pickRandom(ALL_WONDERS, POSITIONS.length), []);

  async function handleHotspot(wonder) {
    if (active?.id === wonder.id) {
      setActive(null);
      return;
    }
    setActive(wonder);
    if (summaries[wonder.id]) return;
    setLoadingId(wonder.id);
    try {
      const data = await fetchWikiSummary(wonder.wikiTitle);
      setSummaries((s) => ({
        ...s,
        [wonder.id]: {
          desc: data.extract?.slice(0, 280) + "…",
          image: data.thumbnail?.source || null,
          url: data.content_urls?.desktop?.page || "#",
        },
      }));
    } catch {
      setSummaries((s) => ({
        ...s,
        [wonder.id]: {
          desc: wonder.fallbackDesc,
          image: null,
          url: `https://en.wikipedia.org/wiki/${wonder.wikiTitle}`,
        },
      }));
    } finally {
      setLoadingId(null);
    }
  }

  const info = active ? summaries[active.id] : null;
  const isLoading = active && loadingId === active.id;

  return (
    <section className="mb-10">
      <div className="flex justify-between items-end mb-5">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Explore the World</h2>
          <p className="text-gray-500 text-sm">
            Click a hotspot to learn about world wonders. Data from Wikipedia.
          </p>
        </div>
        <a
          href="https://www.openstreetmap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#e85d2e] font-bold text-sm flex items-center gap-1 hover:underline"
        >
          Open Atlas <ExternalLink size={13} />
        </a>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="relative flex-1 h-[360px] rounded-2xl overflow-hidden bg-[#cce5f0] shadow-inner border border-gray-200">
          <iframe
            title="World Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-170%2C-60%2C190%2C75&layer=mapnik"
            className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
            style={{ border: 0 }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-100/60 to-blue-200/60" />

          {wonders.map((w) => (
            <button
              key={w.id}
              className="absolute cursor-pointer group focus:outline-none"
              style={{ top: w.top, left: w.left, transform: "translate(-50%,-50%)" }}
              onClick={() => handleHotspot(w)}
              aria-label={w.name}
            >
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-40"
                style={{ backgroundColor: w.color }}
              />
              <span
                className={`relative flex w-5 h-5 rounded-full border-2 border-white items-center justify-center text-[10px] shadow-lg transition-transform duration-200 ${
                  active?.id === w.id ? "scale-150" : "group-hover:scale-125"
                }`}
                style={{ backgroundColor: w.color }}
              >
                {w.emoji}
              </span>
              <span
                className={`absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[10px] font-black px-2 py-0.5 rounded-full shadow whitespace-nowrap transition-opacity ${
                  active?.id === w.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {w.name}
              </span>
            </button>
          ))}

          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow text-left">
            <p className="text-[9px] font-black text-gray-400 tracking-widest mb-2 uppercase">World Wonders</p>
            {wonders.map((w) => (
              <button
                key={w.id}
                onClick={() => handleHotspot(w)}
                className="flex items-center gap-2 mb-1.5 w-full text-left hover:opacity-70 transition-opacity"
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: w.color }} />
                <span className="text-xs text-gray-700 font-medium">{w.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
