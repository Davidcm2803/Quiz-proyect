import { useNavigate, useLocation } from "react-router-dom";
import { Home, FolderOpen, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";

const LIBRARY_SUB = [
  { label: "Mis Quizzes",  path: "/admin/library" },
  { label: "Papelera",     path: "/admin/library/trash", Icon: Trash2 },
];

export default function SidebarItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [libraryOpen, setLibraryOpen] = useState(true);

  const isActive = (path) => location.pathname === path;
  const isLibrary = location.pathname.startsWith("/admin/library");

  const items = [
    { label: "Inicio",     Icon: Home,       path: "/admin" },
    { label: "Biblioteca", Icon: FolderOpen, path: "/admin/library" },
  ];

  return (
    <div className="flex-1 py-3 px-2 space-y-1">
      {items.map(({ label, Icon, path }) => {
        const active = isActive(path) || (label === "Biblioteca" && isLibrary);
        return (
          <div key={label}>
            <button
              onClick={() => {
                if (label === "Biblioteca") setLibraryOpen((o) => !o);
                navigate(path);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all
                ${active
                  ? "bg-[#fde8e0] text-[#e21b3c]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <Icon size={16} strokeWidth={1.75} className="flex-shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {label === "Biblioteca" && (
                <ChevronRight
                  size={13}
                  className={`transition-transform ${libraryOpen ? "rotate-90" : ""}`}
                />
              )}
            </button>

            {label === "Biblioteca" && libraryOpen && (
              <div className="ml-6 mt-0.5 space-y-0.5">
                {LIBRARY_SUB.map(({ label: sub, path: subPath, Icon: SubIcon }) => (
                  <button
                    key={sub}
                    onClick={() => navigate(subPath)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${isActive(subPath)
                        ? "text-[#e21b3c] bg-[#fde8e0]"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    {SubIcon && <SubIcon size={13} className="flex-shrink-0" />}
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}