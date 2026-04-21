import { useState, useEffect } from "react";
import { ZoomIn, Heart, ExternalLink, X } from "lucide-react";
import config from "../../config";

const TOPICS = [
  { query: "ancient architecture",  label: "Ancient Architecture", category: "Architecture" },
  { query: "mountain nature",       label: "Alpine Majesty",        category: "Nature" },
  { query: "space galaxy",          label: "Cosmic Wonder",         category: "Space" },
  { query: "ocean deep sea",        label: "Deep Blue",             category: "Ocean" },
  { query: "renaissance art",       label: "Renaissance",           category: "Art" },
  { query: "jungle rainforest",     label: "Lost in Green",         category: "Nature" },
  { query: "desert landscape",      label: "Desert Dreams",         category: "Nature" },
  { query: "medieval castle",       label: "Stone Empires",         category: "Architecture" },
];

const CATEGORY_BADGE = {
  Architecture: "bg-orange-100 text-orange-700",
  Nature:       "bg-green-100 text-green-700",
  Space:        "bg-indigo-100 text-indigo-700",
  Ocean:        "bg-cyan-100 text-cyan-700",
  Art:          "bg-pink-100 text-pink-700",
};

function buildUrl(query, w = 600) {
  return `https://source.unsplash.com/${w}x${Math.round(w * 1.2)}?${encodeURIComponent(query)}`;
}

async function fetchUnsplashMeta(query) {
  if (!config.UNSPLASH_KEY) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`,
      { headers: { Authorization: `Client-ID ${config.UNSPLASH_KEY}` } }
    );
    const d = await res.json();
    const photo = d.results?.[0];
    if (!photo) return null;
    return {
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      downloadUrl: photo.links.html,
      likes: photo.likes,
      imageUrl: photo.urls.regular,
    };
  } catch {
    return null;
  }
}

function GalleryCard({ query, label, category }) {
  const [liked, setLiked] = useState(false);
  const [meta, setMeta] = useState(null);
  const [imgSrc] = useState(() => buildUrl(query));
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    fetchUnsplashMeta(query).then(setMeta);
  }, [query]);

  const finalUrl = meta?.imageUrl || imgSrc;
  const photoUrl = meta?.downloadUrl || `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;

  return (
    <>
      <div className="break-inside-avoid mb-4 relative group rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-zoom-in">
        <img
          src={finalUrl}
          alt={label}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${encodeURIComponent(query)}/400/500`;
          }}
        />

        <div
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4"
          onClick={() => setLightbox(true)}
        >
          <div className="flex justify-end gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setLiked((l) => !l); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                liked ? "bg-red-500" : "bg-white/20 hover:bg-white/35"
              }`}
            >
              <Heart size={13} color="white" fill={liked ? "white" : "none"} />
            </button>
            <a
              href={photoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center"
            >
              <ExternalLink size={13} color="white" />
            </a>
          </div>

          <div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block ${CATEGORY_BADGE[category] || "bg-gray-100 text-gray-600"}`}>
              {category}
            </span>
            <p className="text-white font-black text-sm">{label}</p>
            {meta?.photographer && (
              <a
                href={meta.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white/50 text-[10px] hover:text-white/80 transition-colors"
              >
                📷 {meta.photographer}
              </a>
            )}
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/35"
            onClick={() => setLightbox(false)}
          >
            <X size={18} color="white" />
          </button>
          <img
            src={finalUrl}
            alt={label}
            className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <p className="text-white font-black text-lg">{label}</p>
            {meta?.photographer && (
              <p className="text-white/50 text-sm">Photo by {meta.photographer} on Unsplash</p>
            )}
            <a
              href={photoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e85d2e] text-sm font-bold hover:underline mt-1 block"
            >
              View on Unsplash →
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default function VisualInspiration() {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-end mb-5">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Visual Inspiration</h2>
          <p className="text-gray-500 text-sm">
            Curated photos from{" "}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#e85d2e]">
              Unsplash
            </a>
            . Click any photo to expand.
            {!config.UNSPLASH_KEY && (
              <span className="text-amber-600 ml-2 text-[11px]">
                (Add <code className="bg-gray-100 px-1 rounded">VITE_UNSPLASH_KEY</code> for photographer credits)
              </span>
            )}
          </p>
        </div>
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#e85d2e] font-bold text-sm hover:underline flex items-center gap-1"
        >
          <ZoomIn size={14} /> Browse all
        </a>
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {TOPICS.map((t) => (
          <GalleryCard key={t.query} {...t} />
        ))}
      </div>
    </section>
  );
}