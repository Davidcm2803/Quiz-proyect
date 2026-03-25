import { useState } from "react";
import { X, CheckCircle2, Loader2, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const BASE_URL = "http://localhost:8000";
const MIN = 3;
const MAX = 30;
const REGEX = /^[a-zA-Z0-9._]+$/;

const validate = (val, current) => {
  if (!val.trim())      return "El nombre no puede estar vacío.";
  if (val.length < MIN) return `Mínimo ${MIN} caracteres.`;
  if (val.length > MAX) return `Máximo ${MAX} caracteres.`;
  if (!REGEX.test(val)) return "Solo letras, números, puntos y guiones bajos.";
  if (val === current)  return "Es el mismo nombre que tienes ahora.";
  return "";
};

export default function ChangeUsernameModal({ onClose }) {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");

  const touched    = username !== (user?.username ?? "");
  const fieldError = validate(username, user?.username);

  const handleSave = async () => {
    const err = validate(username, user?.username);
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/users/${user.id}/username`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      updateUser?.({ ...user, username: username.trim() });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 1400);
    } catch (e) {
      setError(e?.detail ?? "No se pudo actualizar el nombre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <ModalHeader Icon={User} title="Cambiar nombre" onClose={onClose} />

      <div className="px-5 py-4 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Nuevo nombre de usuario
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            maxLength={MAX}
            autoComplete="username"
            placeholder="ej. maria_garcia"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all
              ${touched && fieldError
                ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-[#e21b3c] focus:ring-2 focus:ring-[#fde8e0]"
              }`}
          />
          <div className="flex justify-between mt-1.5">
            <p className={`text-xs ${touched && fieldError ? "text-red-500" : "text-gray-400"}`}>
              {touched && fieldError ? fieldError : "Letras, números, puntos y guiones bajos."}
            </p>
            <p className="text-xs text-gray-300">{username.length}/{MAX}</p>
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>

      <ModalFooter onClose={onClose}>
        <Button
          variant={success ? "primary" : "signup"}
          onClick={handleSave}
          disabled={loading || success || !!fieldError || !touched}
          className={success ? "!bg-green-500 hover:!bg-green-500" : ""}
        >
          {loading && <Loader2      size={14} className="animate-spin" />}
          {success && <CheckCircle2 size={14} />}
          {success ? "¡Listo!" : loading ? "Guardando..." : "Guardar"}
        </Button>
      </ModalFooter>
    </Overlay>
  );
}

export function Overlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ Icon, title, onClose }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Icon size={15} className="text-[#e21b3c]" />
        <p className="text-sm font-bold text-gray-800">{title}</p>
      </div>
      <button
        onClick={onClose}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
      >
        <X size={14} className="text-gray-400" />
      </button>
    </div>
  );
}

export function ModalFooter({ onClose, children }) {
  return (
    <div className="flex gap-2 px-5 pb-5">
      <Button variant="exit" onClick={onClose} className="flex-1 justify-center">
        Cancelar
      </Button>
      <div className="flex-1">{children}</div>
    </div>
  );
}