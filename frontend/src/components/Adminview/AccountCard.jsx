export default function AccountCard({ user }) {
  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
      <div className="w-12 h-12 bg-[#e21b3c] rounded-full flex items-center justify-center flex-shrink-0 shadow">
        <span className="text-white text-xl font-black">
          {user.username?.[0]?.toUpperCase()}
        </span>
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{user.username}</p>
        <p className="text-xs text-gray-400 truncate">{user.email}</p>
        <span className="inline-block mt-1 text-xs bg-[#fde8e0] text-[#e21b3c] font-semibold px-2 py-0.5 rounded-full capitalize">
          {user.role}
        </span>
      </div>
    </div>
  );
}