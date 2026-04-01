import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus, Sparkles } from "lucide-react";

const CREATE_ITEMS = [
  { id: 1, bgColor: "#ef4444", Icon: Plus,     label: "Crear desde cero", path: "/quiz/create" },
  { id: 2, bgColor: "#16a34a", Icon: Sparkles, label: "Crear con IA",     path: "/quiz/ai" },
];

export default function CreateDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md"
      >
        <Plus size={15} strokeWidth={2.5} />
        Crear
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50">
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Nuevo contenido
          </p>
          {CREATE_ITEMS.map(({ id, bgColor, Icon, label, path }) => (
            <button
              key={id}
              onClick={() => { navigate(path); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bgColor }}
              >
                <Icon size={14} color="white" strokeWidth={2.5} />
              </div>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}