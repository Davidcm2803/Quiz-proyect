import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function UserDropdown() {
  const { user, logout } = useAuth();
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

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 transition-all shadow-sm"
      >
        <div className="w-6 h-6 bg-[#e21b3c] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-black">
            {user.username?.[0]?.toUpperCase()}
          </span>
        </div>
        <span className="max-w-[100px] truncate">{user.username}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-400">Conectado como</p>
            <p className="text-sm font-semibold text-gray-700 truncate">{user.username}</p>
          </div>
          <button
            onClick={() => { navigate("/admin"); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <User size={15} className="text-gray-400" />
            Mi perfil
          </button>
          <button
            onClick={() => { logout(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#e21b3c] hover:bg-red-50 transition-colors border-t border-gray-100"
          >
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}