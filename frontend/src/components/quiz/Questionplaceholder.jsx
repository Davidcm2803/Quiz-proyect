export default function QuestionPlaceholder({ value, onChange }) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing your question"
        className="w-full text-center text-xl font-semibold text-gray-700 bg-white border border-gray-200 rounded-2xl px-8 py-6 outline-none focus:ring-2 
        focus:ring-gray-300 focus:text-gray-900 transition-all placeholder:text-gray-400 shadow-sm"
      />
    </div>
  );
}