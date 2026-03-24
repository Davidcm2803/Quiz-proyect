import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  LogOut,
  Plus,
  Sparkles,
  FileText,
  LayoutGrid,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";

const CREATE_ITEMS = [
  {
    id: 1,
    bgColor: "#ef4444",
    Icon: Plus,
    label: "Crear desde cero",
    path: "/quiz/create",
  },
  {
    id: 2,
    bgColor: "#16a34a",
    Icon: Sparkles,
    label: "Crear con IA",
    path: "/quiz/ai",
  },
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
        className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md"
      >
        <Plus size={15} strokeWidth={2.5} />
        Crear
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50">
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Nuevo contenido
          </p>
          {CREATE_ITEMS.map(({ id, bgColor, Icon, label, path }) => (
            <button
              key={id}
              onClick={() => {
                navigate(path);
                setOpen(false);
              }}
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
        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 transition-all shadow-sm"
      >
        <div className="w-6 h-6 bg-[#e21b3c] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-black">
            {user.username?.[0]?.toUpperCase()}
          </span>
        </div>
        <span className="max-w-[100px] truncate">{user.username}</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-400">Conectado como</p>
            <p className="text-sm font-semibold text-gray-700 truncate">
              {user.username}
            </p>
          </div>
          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <User size={15} className="text-gray-400" />
            Mi perfil
          </button>
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
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

  return (
    <nav className="bg-[#fde8e0] px-6 h-16 flex items-center justify-between relative z-50 border-b border-gray-200">
      <img
        src={logo}
        alt="QHit logo"
        className="h-20 w-auto object-contain cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="flex items-center gap-3">
        <CreateDropdown />
        {user && <UserDropdown user={user} logout={logout} />}
      </div>
    </nav>
  );
}