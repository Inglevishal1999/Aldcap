import { Outlet, useLocation, useNavigate } from "react-router-dom";

import EmployeeSidebar from "./EmployeeSlidebar";
import EmployeeHeader from "./EmployeeHeader";

// =====================================================
// Maps a route key to the title shown in EmployeeHeader.
// Keep in sync with EmployeeSidebar's item keys and the
// nested routes defined in App.jsx.
// =====================================================

const TITLES = {
  dashboard: "Dashboard",
  "duty-roster": "Duty Roster",
};

export default function EmployeeLayout({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  // "/employee/duty-roster" -> "duty-roster"; "/employee" -> "dashboard"
  const segment = location.pathname.split("/employee/")[1] || "dashboard";
  const active = segment.split("/")[0];

  const handleNavigate = (key) => {
    navigate(key === "dashboard" ? "/employee" : `/employee/${key}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <EmployeeSidebar
        active={active}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <EmployeeHeader
          title={TITLES[active] || "Dashboard"}
          userName={user?.name || "Employee"}
        />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}