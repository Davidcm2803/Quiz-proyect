import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown, User, LogOut, Plus, Sparkles, Menu, X,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import SidebarItems from "../ui/SidebarItems";

const FOOTER_LINKS = ["¿Qué hay de nuevo?", "Ponte en contacto", "Documentacion"];

const CREATE_ITEMS = [
  { id: 1, bgColor: "#ef4444", Icon: Plus,     label: "Crear desde cero", path: "/quiz/create" },
  { id: 2, bgColor: "#16a34a", Icon: Sparkles, label: "Crear con IA",     path: "/quiz/ai" },
];

function CreateDropdown() {
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
        className="flex items-center gap-1.5 bg-[#4285F4] hover:bg-[#3367D6] text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-md"
      >
        <Plus size={15} strokeWidth={2.5} />
        <span className="hidden sm:inline">Crear</span>
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

function UserDropdown({ user, logout }) {
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
        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 px-2.5 py-1.5 rounded-xl text-sm font-semibold text-gray-700 transition-all shadow-sm"
      >
        <div className="w-6 h-6 bg-[#e21b3c] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-black">
            {user.username?.[0]?.toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:block max-w-[80px] truncate">{user.username}</span>
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

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className="bg-[#fde8e0] px-3 sm:px-6 h-16 flex items-center justify-between relative z-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/60 hover:bg-white/90 transition-all shadow-sm border border-black/10 flex-shrink-0"
            onClick={() => setDrawerOpen((o) => !o)}
          >
            {drawerOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
          </button>
          <img
            src={logo}
            alt="QHit logo"
            className="h-16 w-auto object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="flex items-center gap-2">
          <CreateDropdown />
          {user && <UserDropdown user={user} logout={logout} />}
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 md:hidden ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          drawerOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <img src={logo} alt="QHit logo" className="h-14 w-auto object-contain" />
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} strokeWidth={2.5} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarItems onNavigate={() => setDrawerOpen(false)} />
        </div>
        <div className="border-t border-gray-100 px-2 py-3 space-y-0.5">
          {FOOTER_LINKS.map((label) => (
            <button
              key={label}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}