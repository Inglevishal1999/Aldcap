import { Bell, User } from "lucide-react";

// =====================================================
// EMPLOYEE HEADER
// Mirrors AdminHeader for visual consistency between portals.
// =====================================================

export default function EmployeeHeader({ title = "Dashboard", userName = "Employee" }) {
  return (
    <header
      className="
        flex h-16 items-center justify-between
        border-b border-slate-200 bg-white
        px-6 sm:px-8
      "
    >
      <h1 className="text-lg font-bold text-blue-950 sm:text-xl">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <button
          className="
            rounded-full p-2 text-gray-400
            transition hover:bg-slate-100 hover:text-blue-900
          "
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-950 text-white">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-blue-950">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}