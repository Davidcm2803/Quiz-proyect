export default function AccountCard({ user }) {
  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col items-center gap-2 text-center">
      <div className="w-14 h-14 bg-[#e21b3c] rounded-full flex items-center justify-center shadow">
        <span className="text-white text-2xl font-black">
          {user.username?.[0]?.toUpperCase()}
        </span>
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-sm">{user.username}</p>
        <p className="text-xs text-gray-400">{user.email}</p>
        <span className="inline-block mt-1 text-xs bg-[#fde8e0] text-[#e21b3c] font-semibold px-2 py-0.5 rounded-full capitalize">
          {user.role}
        </span>
      </div>
    </div>
  );
}