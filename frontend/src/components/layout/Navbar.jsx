import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Compass, GraduationCap, Play, Settings, Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import logo from "../../assets/logo.png";
import Button from "../ui/Button";
import NavItem from "../ui/NavItem";
import JoinButton from "../ui/Joinbutton";
import MobileMenu from "../ui/MobileMenu";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { label: "Discover", Icon: Compass,       path: "/discover", desc: "Browse all content" },
  { label: "Learn",    Icon: GraduationCap, path: "/learn",    desc: "Study at your pace" },
  { label: "Present",  Icon: Play,          path: "/present",  desc: "Run live sessions" },
  { label: "Make",     Icon: Settings,      path: "/",         desc: "Create kahoots" },
];

function UserDropdown({ user, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // cierra al hacer click afuera
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
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-400">Conectado como</p>
            <p className="text-sm font-semibold text-gray-700 truncate">{user.username}</p>
          </div>
          <button
            onClick={() => { navigate("/profile"); setOpen(false); }}
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

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="bg-[#fde8e0] px-6 h-16 flex items-center justify-between relative z-50">
        <img
          src={logo}
          alt="QHit logo"
          className="h-20 w-auto object-contain cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="hidden md:flex items-center gap-2 flex-1 ml-2">
          {NAV_ITEMS.map(({ label, Icon, path }) => (
            <NavItem
              key={label}
              label={label}
              Icon={Icon}
              active={location.pathname === path}
              onClick={() => navigate(path)}
            />
          ))}
          <JoinButton
            active={location.pathname === "/join"}
            onClick={() => navigate("/join")}
          />
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <UserDropdown user={user} logout={logout} />
          ) : (
            <Button variant="signup" onClick={() => navigate("/register")}>
              Sign up
            </Button>
          )}
        </div>

        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/60 hover:bg-white/90 transition-all shadow-sm border border-black/10"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
        </button>
      </nav>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        navItems={NAV_ITEMS}
        location={location}
        navigate={navigate}
      />
    </>
  );
}