import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { Overlay, ModalHeader, ModalFooter } from "./ChangeUsernameModal";
import config from "../../config";

const RULES = [
  { id: "length",  label: "Al menos 8 caracteres",         test: (p) => p.length >= 8 },
  { id: "upper",   label: "Una mayúscula",                  test: (p) => /[A-Z]/.test(p) },
  { id: "lower",   label: "Una minúscula",                  test: (p) => /[a-z]/.test(p) },
  { id: "number",  label: "Un número",                      test: (p) => /\d/.test(p) },
  { id: "special", label: "Un carácter especial (!@#$...)", test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

const STRENGTH_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];
const STRENGTH_LABELS = ["", "Muy débil", "Débil", "Regular", "Buena", "Fuerte"];

function StrengthBar({ password }) {
  const passed = RULES.filter((r) => r.test(password)).length;
  if (!password) return null;
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {RULES.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < passed ? STRENGTH_COLORS[passed] : "#e5e7eb" }}
          />
        ))}
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          {RULES.map((rule) => (
            <div key={rule.id} className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors
                ${rule.test(password) ? "bg-green-500" : "bg-gray-200"}`}
              />
              <span className={`text-xs ${rule.test(password) ? "text-gray-500" : "text-gray-300"}`}>
                {rule.label}
              </span>
            </div>
          ))}
        </div>
        <span className="text-xs font-semibold flex-shrink-0 mt-0.5"
          style={{ color: STRENGTH_COLORS[passed] || "#9ca3af" }}>
          {STRENGTH_LABELS[passed]}
        </span>
      </div>
    </div>
  );
}

function PwInput({ value, onChange, placeholder, autoComplete, id }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm
          focus:border-[#e21b3c] focus:ring-2 focus:ring-[#fde8e0] outline-none transition-all"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function ChangePasswordModal({ onClose }) {
  const { user } = useAuth();
  const [current, setCurrent] = useState("");
  const [next,    setNext]    = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const passed     = RULES.filter((r) => r.test(next)).length;
  const isStrong   = passed >= 4;
  const matchError = confirm && next !== confirm;
  const canSubmit  = current && isStrong && next === confirm;

  const handleSave = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${config.API_URL}/users/${user.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: current, new_password: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = Array.isArray(data.detail)
          ? data.detail[0]?.msg || "Error de validación"
          : data.detail || "No se pudo actualizar la contraseña.";
        setError(msg);
        return;
      }
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 1600);
    } catch (e) {
      setError("No se pudo actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <ModalHeader Icon={Lock} title="Cambiar contraseña" onClose={onClose} />

      <div className="px-5 py-4 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contraseña actual</label>
          <PwInput
            id="cur-pw"
            value={current}
            onChange={(e) => { setCurrent(e.target.value); setError(""); }}
            placeholder="Tu contraseña actual"
            autoComplete="current-password"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nueva contraseña</label>
          <PwInput
            id="new-pw"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="Crea una contraseña segura"
            autoComplete="new-password"
          />
          <StrengthBar password={next} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirmar contraseña</label>
          <PwInput
            id="conf-pw"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repite la contraseña"
            autoComplete="new-password"
          />
          {matchError && <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden.</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-start gap-2 bg-[#fde8e0] rounded-xl px-4 py-2.5">
          <ShieldCheck size={13} className="text-[#e21b3c] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#e21b3c]">
            Al cambiar tu contraseña se cerrará sesión en otros dispositivos.
          </p>
        </div>
      </div>

      <ModalFooter onClose={onClose}>
        <Button
          variant={success ? "primary" : "signup"}
          onClick={handleSave}
          disabled={loading || success || !canSubmit}
          className={`w-full justify-center ${success ? "!bg-green-500 hover:!bg-green-500" : ""}`}
        >
          {loading && <Loader2      size={14} className="animate-spin" />}
          {success && <CheckCircle2 size={14} />}
          {success ? "¡Lista!" : loading ? "Guardando..." : "Cambiar"}
        </Button>
      </ModalFooter>
    </Overlay>
  );
}