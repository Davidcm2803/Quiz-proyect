import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import logo from "../../assets/logo.png";

export default function SecondaryNavbar({ onLanguageChange }) {
  const navigate = useNavigate();
  const [lang, setLang] = useState("EN");

  const toggleLang = () => {
    const next = lang === "EN" ? "ES" : "EN";
    setLang(next);
    if (onLanguageChange) onLanguageChange(next);
  };

  return (
    <nav className="px-6 h-16 flex items-center justify-between relative z-50 bg-[#F8FBF3]">
      <img
        src={logo}
        alt="QHit logo"
        className="h-20 w-auto object-contain cursor-pointer"
        onClick={() => navigate("/")}
      />
      <button
        onClick={toggleLang}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-sm font-medium text-gray-700"
      >
        <Globe size={16} className="text-gray-500" />
        {lang === "EN" ? "English" : "Español"}
      </button>
    </nav>
  );
}