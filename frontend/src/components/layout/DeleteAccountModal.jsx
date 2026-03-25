import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { Overlay, ModalHeader } from "./ChangeUsernameModal";

const BASE_URL = "http://localhost:8000";
const CONFIRM_WORD = "ELIMINAR";

export default function DeleteAccountModal({ onClose }) {
  const { user, logout } = useAuth();
  const [typed,   setTyped]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const confirmed = typed.trim() === CONFIRM_WORD;

  const handleDelete = async () => {
    if (!confirmed) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw data;
      logout();
    } catch (e) {
      setError(e?.detail ?? "No se pudo eliminar la cuenta.");
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <ModalHeader Icon={Trash2} title="Eliminar cuenta" onClose={onClose} />

      <div className="px-5 py-4 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Esta acción es <strong>permanente</strong>. Se borrarán tu cuenta, quizzes y todos tus datos.
        </p>

        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-xs text-red-600">
          Escribe <span className="font-mono font-bold">{CONFIRM_WORD}</span> para confirmar.
        </div>

        <input
          type="text"
          value={typed}
          onChange={(e) => { setTyped(e.target.value); setError(""); }}
          placeholder={CONFIRM_WORD}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono
            tracking-widest focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all"
        />

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="flex gap-2 px-5 pb-5">
        <Button variant="exit" onClick={onClose} className="flex-1 justify-center">
          Cancelar
        </Button>
        <button
          onClick={handleDelete}
          disabled={!confirmed || loading}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg
            bg-red-600 hover:bg-red-700 text-white text-sm font-semibold
            transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Eliminando..." : "Sí, eliminar"}
        </button>
      </div>
    </Overlay>
  );
}