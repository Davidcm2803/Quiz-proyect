import logo from "../../assets/logo.png";
import { X } from "lucide-react";
import NavItem from "./Navitem";
import JoinButton from "./Joinbutton";

export default function MobileMenu({
  open,
  onClose,
  navItems,
  location,
  navigate,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <img
            src={logo}
            alt="QHit logo"
            className="h-14 w-auto object-contain"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} strokeWidth={2.5} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ label, Icon, path, desc }) => (
            <NavItem
              key={label}
              label={label}
              Icon={Icon}
              desc={desc}
              active={location.pathname === path}
              onClick={() => {
                navigate(path);
                onClose();
              }}
              mobile
            />
          ))}
          <JoinButton
            active={location.pathname === "/join"}
            onClick={() => {
              navigate("/join");
              onClose();
            }}
            mobile
          />
        </div>
        <div className="px-5 py-5 border-t border-gray-100">
          <button
            onClick={() => {
              navigate("/signup");
              onClose();
            }}
            className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold py-3 rounded-xl transition-all active:scale-95 text-sm shadow-md"
          >
            Sign up
          </button>
        </div>
      </div>
    </>
  );
}
