import logo from "../../assets/logo.png";
import { X, User, LogOut } from "lucide-react";
import NavItem from "./NavItem";
import JoinButton from "./JoinButton";
import { useAuth } from "../../context/AuthContext";

export default function MobileMenu({
  open,
  onClose,
  navItems,
  location,
  navigate,
  user,
}) {
  const { logout } = useAuth();

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
          {user ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 px-2 py-2 mb-1">
                <div className="w-8 h-8 bg-[#e21b3c] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-black">
                    {user.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Conectado como</p>
                  <p className="text-sm font-semibold text-gray-700 truncate">
                    {user.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigate("/admin");
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <User size={15} className="text-gray-400" />
                Mi perfil
              </button>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#e21b3c] hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={15} />
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/signup");
                onClose();
              }}
              className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold py-3 rounded-xl transition-all active:scale-95 text-sm shadow-md"
            >
              Sign up
            </button>
          )}
        </div>
      </div>
    </>
  );
}