import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "../ui/Button";

export default function QuizNavbar({ title, onTitleChange, onExit, onSave, saving }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#fde8e0] px-3 sm:px-6 h-16 flex items-center justify-between relative z-50 gap-2 sm:gap-4">
      <img
        src={logo}
        alt="QHit logo"
        className="h-20 w-auto object-contain cursor-pointer flex-shrink-0"
        onClick={() => navigate("/")}
      />
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Quiz title"
        className="w-40 sm:w-56 md:w-100 mx-auto bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 transition-all text-center"
      />
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <Button variant="exit" onClick={onExit ?? (() => navigate("/"))}>
          <span className="hidden sm:inline">Exit</span>
          <span className="sm:hidden">✕</span>
        </Button>
        <Button variant="save" onClick={onSave} disabled={saving}>
          {saving ? (
            <span className="hidden sm:inline">Guardando...</span>
          ) : (
            <span className="hidden sm:inline">Save</span>
          )}
          {saving ? (
            <span className="sm:hidden">...</span>
          ) : (
            <span className="sm:hidden">✓</span>
          )}
        </Button>
      </div>
    </nav>
  );
}