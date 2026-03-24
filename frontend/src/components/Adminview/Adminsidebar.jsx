import SidebarItems from "../ui/SidebarItems";

const FOOTER_LINKS = ["¿Qué hay de nuevo?", "Ponte en contacto", "Documentacion"];

export default function AdminSidebar() {
  return (
    <aside className="w-56 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 flex flex-col overflow-y-auto flex-shrink-0">
      <SidebarItems />

      <div className="border-t border-gray-100 px-2 py-3 space-y-0.5">
        {FOOTER_LINKS.map((label) => (
          <button
            key={label}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
          >
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}