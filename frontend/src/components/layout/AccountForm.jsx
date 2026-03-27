import { useState } from "react";
import { User, Lock, Trash2, ChevronRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AccountCard from "../Adminview/AccountCard";
import ChangeUsernameModal from "./ChangeUsernameModal";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";

const SECTIONS = [
  {
    id: "username",
    label: "Nombre de usuario",
    Icon: User,
    description: "Cambia cómo te ven los demás",
  },
  {
    id: "password",
    label: "Contraseña",
    Icon: Lock,
    description: "Actualiza tu contraseña de acceso",
  },
  {
    id: "security",
    label: "Seguridad",
    Icon: ShieldCheck,
    description: "Información de tu cuenta",
  },
];

export default function AccountForm() {
  const { user } = useAuth();
  const [modal, setModal] = useState(null);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-transparent px-4 py-10">
      <div className="max-w-xl mx-auto space-y-5">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Mi cuenta</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Gestiona tu información y seguridad
          </p>
        </div>

        <AccountCard user={user} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {SECTIONS.map(({ id, label, Icon, description }, idx) => (
            <div key={id}>
              {idx !== 0 && <div className="border-t border-gray-100 mx-4" />}
              <button
                onClick={() => id !== "security" && setModal(id)}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors
                  ${id !== "security" ? "hover:bg-gray-50" : "cursor-default"}`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#fde8e0] flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[#e21b3c]" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{description}</p>
                </div>
                {id !== "security" && (
                  <ChevronRight
                    size={15}
                    className="text-gray-300 flex-shrink-0"
                  />
                )}
              </button>

              {id === "security" && (
                <div className="px-5 pb-4 -mt-1 space-y-1">
                  <InfoRow label="Email" value={user?.email} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-red-100 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-red-500 mb-1">
            Zona de peligro
          </p>
          <p className="text-xs text-gray-400 mb-3">
            Esta acción es permanente e irreversible.
          </p>
          <button
            onClick={() => setModal("delete")}
            className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors mx-auto"
          >
            <Trash2 size={13} />
            Eliminar mi cuenta
          </button>
        </div>
      </div>

      {modal === "username" && (
        <ChangeUsernameModal onClose={() => setModal(null)} />
      )}
      {modal === "password" && (
        <ChangePasswordModal onClose={() => setModal(null)} />
      )}
      {modal === "delete" && (
        <DeleteAccountModal onClose={() => setModal(null)} />
      )}
    </main>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-600 font-medium truncate max-w-[60%] text-right">
        {value || "—"}
      </span>
    </div>
  );
}
