import { useState, useRef, useEffect } from "react";
import { ImagePlus, X, Search, Upload, Loader2 } from "lucide-react";
import config from "../../config";

function UnsplashModal({ onSelect, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const search = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=16&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${config.UNSPLASH_KEY}` } }
      );
      if (!res.ok) throw new Error("Error buscando imágenes");
      const data = await res.json();
      setResults(data.results);
      if (data.results.length === 0) setError("No se encontraron imágenes");
    } catch {
      setError("Error al conectar con Unsplash");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-[#1a1a1a]">Buscar imagen</h2>
            <p className="text-xs text-gray-400 mt-0.5">Powered by Unsplash</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search(query)}
                placeholder="Busca una imagen... ej: Dune, Ingles, Leon S Kennedy"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#fde8e0] focus:border-[#e21b3c] transition-all"
              />
            </div>
            <button
              onClick={() => search(query)}
              disabled={loading || !query.trim()}
              className="bg-[#1a1a1a] hover:bg-[#333] disabled:opacity-40 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all active:scale-95"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Buscar"}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {error && (
            <p className="text-gray-400 text-sm text-center py-8">{error}</p>
          )}

          {!error && results.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">Escribe algo para buscar imágenes</p>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-video bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {results.map((img) => (
                <button
                  key={img.id}
                  onClick={() => onSelect(img.urls.regular)}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100 hover:ring-2 hover:ring-[#e21b3c] transition-all"
                >
                  <img
                    src={img.urls.small}
                    alt={img.alt_description}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end p-2 opacity-0 group-hover:opacity-100">
                    <p className="text-white text-[10px] font-medium truncate w-full">
                      {img.user.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ImageUploader({ image, onImageChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onImageChange(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUnsplashSelect = (url) => {
    onImageChange(url);
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <UnsplashModal
          onSelect={handleUnsplashSelect}
          onClose={() => setShowModal(false)}
        />
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center transition-all border-2 border-dashed
          ${image ? "border-transparent" : dragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white/60 hover:bg-white/80"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {image ? (
          <>
            <img src={image} alt="uploaded" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={() => setShowModal(true)}
                className="w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
                title="Cambiar imagen"
              >
                <Search size={12} />
              </button>
              <button
                onClick={() => onImageChange(null)}
                className="w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
                title="Quitar imagen"
              >
                <X size={12} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-400 px-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <ImagePlus size={22} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-center">Agrega una imagen</p>
            <div className="flex gap-2">
              <button
                onClick={() => inputRef.current.click()}
                className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-xs font-semibold px-3 py-2 rounded-lg transition-all active:scale-95"
              >
                <Upload size={12} />
                Subir
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#333] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all active:scale-95"
              >
                <Search size={12} />
                Buscar en Unsplash
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}