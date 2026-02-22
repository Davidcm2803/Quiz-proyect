import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "../ui/Button";

export default function QuizNavbar({ title, onTitleChange, onExit, onSave }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#fde8e0] px-6 h-16 flex items-center justify-between relative z-50 gap-4">
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
        className="flex-1 max-w-xs bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 transition-all"
      />

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button variant="exit" onClick={onExit ?? (() => navigate("/"))}>
          Exit
        </Button>
        <Button variant="save" onClick={onSave}>
          Save
        </Button>
      </div>
    </nav>
  );
}