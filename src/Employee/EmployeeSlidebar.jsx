import { LayoutDashboard, CalendarClock, Zap, LogOut } from "lucide-react";

// =====================================================
// NAV ITEM
// =====================================================

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex w-full items-center gap-3 rounded-lg
        px-3 py-2.5 text-sm font-medium
        transition-colors duration-150
        ${
          active
            ? "bg-yellow-400 text-blue-950"
            : "text-blue-200 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      {Icon && (
        <Icon
          className={`h-4 w-4 shrink-0 ${
            active ? "text-blue-950" : "text-blue-300 group-hover:text-white"
          }`}
        />
      )}
      <span className="truncate">{label}</span>
    </button>
  );
}

// =====================================================
// EMPLOYEE SIDEBAR
// =====================================================

export default function EmployeeSidebar({
  active = "dashboard",
  onNavigate = () => {},
  onLogout = () => {},
}) {
  return (
    <aside className="flex h-screen w-64 flex-col bg-[#111f5c] text-white">
      {/* LOGO */}
      <div className="px-5 pb-4 pt-6">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-extrabold tracking-[0.2em] text-white">
            ALDC ENERGY
          </span>
        </div>
        <p className="mt-1 pl-6 text-[11px] font-semibold tracking-[0.25em] text-blue-300">
          EMPLOYEE PANEL
        </p>
      </div>

      <div className="mx-5 border-t border-white/10" />

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="space-y-0.5 pt-4">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={active === "dashboard"}
            onClick={() => onNavigate("dashboard")}
          />

          <NavItem
            icon={CalendarClock}
            label="Duty Roster"
            active={active === "duty-roster"}
            onClick={() => onNavigate("duty-roster")}
          />
        </div>
      </nav>

      {/* FOOTER */}
      <div className="mx-5 border-t border-white/10" />

      <div className="px-3 py-4">
        <button
          onClick={onLogout}
          className="
            flex w-full items-center gap-3 rounded-lg
            px-3 py-2.5 text-sm font-medium
            text-red-300 transition-colors
            hover:bg-red-500/10 hover:text-red-200
          "
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}