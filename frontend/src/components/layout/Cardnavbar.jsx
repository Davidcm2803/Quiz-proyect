import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

export default function CardNavbar({ title, onCancel }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#fde8e0] px-6 h-16 flex items-center justify-between z-50 gap-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center">
          <Sparkles size={16} color="white" />
        </div>
        <span className="font-black text-[#1a1a1a] text-lg">{title}</span>
      </div>
      <Button variant="save" onClick={onCancel ?? (() => navigate("/"))}>
        Inicio
      </Button>
    </nav>
  );
}