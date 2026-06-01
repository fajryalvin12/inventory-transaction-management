function Navbar({ title, user, onSignOut }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
      <h1 className="text-base font-semibold text-gray-800 tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <span className="text-lg">🔔</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User info + sign out */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
            {user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-none">{user?.email ?? "—"}</p>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role ?? ""}</p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className="ml-1 text-xs font-medium text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Navbar;
