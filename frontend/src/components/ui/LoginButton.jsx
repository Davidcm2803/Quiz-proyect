export default function LoginButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-[13px] bg-[#1a1a1a] hover:bg-[#333] text-white border-none rounded-lg text-[15px] 
      font-semibold cursor-pointer mb-[14px] font-inherit transition-colors"
    >
      {children}
    </button>
  );
}
