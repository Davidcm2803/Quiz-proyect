import { ChevronRight } from "lucide-react";
import Button from "./Button";

// Uso desktop: <NavItem label="Make" Icon={Settings} path="/" active={...} onClick={...} />
// Uso mobile: <NavItem label="Make" Icon={Settings} desc="..." active={...} onClick={...} mobile />

export default function NavItem({ label, Icon, desc, active, onClick, mobile = false }) {
  if (mobile) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group ${
          active ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
          active ? "bg-red-100" : "bg-gray-100 group-hover:bg-gray-200"
        }`}>
          <Icon size={17} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{label}</p>
          {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
        </div>
        <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
      </button>
    );
  }

  return (
    <Button
      variant="nav"
      onClick={onClick}
      className={active ? "ring-2 ring-red-400" : ""}
    >
      <Icon size={15} strokeWidth={2} />
      {label}
    </Button>
  );
}