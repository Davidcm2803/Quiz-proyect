export default function IconButton({ icon, label, onClick }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="flex-1 h-[44px] bg-white border border-[#ddd] rounded-lg cursor-pointer flex items-center justify-center 
      hover:border-[#999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all"
    >
      {icon}
    </button>
  );
}