import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Compass, GraduationCap, Play, Settings, Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";
import Button from "../ui/Button";
import NavItem from "../ui/NavItem";
import JoinButton from "../ui/Joinbutton";
import MobileMenu from "../ui/MobileMenu";

const NAV_ITEMS = [
  {
    label: "Discover",
    Icon: Compass,
    path: "/discover",
    desc: "Browse all content",
  },
  {
    label: "Learn",
    Icon: GraduationCap,
    path: "/learn",
    desc: "Study at your pace",
  },
  { label: "Present", Icon: Play, path: "/present", desc: "Run live sessions" },
  { label: "Make", Icon: Settings, path: "/", desc: "Create kahoots" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="bg-[#fde8e0] px-6 h-16 flex items-center justify-between relative z-50">
        <img
          src={logo}
          alt="QHit logo"
          className="h-20 w-auto object-contain cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop links */}
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

        {/* Desktop sign up */}
        <div className="hidden md:block">
          <Button variant="signup" onClick={() => navigate("/register")}>
            Sign up
          </Button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/60 hover:bg-white/90 transition-all shadow-sm border border-black/10"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <X size={18} strokeWidth={2.5} />
          ) : (
            <Menu size={18} strokeWidth={2.5} />
          )}
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
