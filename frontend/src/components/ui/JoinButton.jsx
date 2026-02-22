import { ChevronRight } from "lucide-react";
import Button from "./Button";

const JoinColorIcon = () => (
  <div className="grid grid-cols-2 gap-[2px] w-4 h-4 flex-shrink-0">
    <div className="bg-red-500 rounded-[2px]" />
    <div className="bg-blue-500 rounded-[2px]" />
    <div className="bg-yellow-400 rounded-[2px]" />
    <div className="bg-green-500 rounded-[2px]" />
  </div>
);

export default function JoinButton({ active, onClick, mobile = false }) {
  if (mobile) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group ${
          active ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
          active ? "bg-red-100" : "bg-gray-100 group-hover:bg-gray-200"
        }`}>
          <JoinColorIcon />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Join</p>
          <p className="text-xs text-gray-400 mt-0.5">Enter a game code</p>
        </div>
        <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
      </button>
    );
  }

  return (
    <Button
      variant="nav"
      onClick={onClick}
      className={active ? "ring-2 ring-red-400" : ""}
    >
      <JoinColorIcon />
      Join
    </Button>
  );
}