import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSlidebar";
import AdminHeader from "./AdminHeader";

const TITLES = {
  dashboard: "Dashboard",
  "hero-slider": "Hero Slider",
  about: "About",
  services: "Services",
  safety: "Safety",
  "power-stations": "Power Stations",
  gallery: "Gallery",
  news: "News",
  blog: "Blog",
  careers: "Careers",
  messages: "Messages",
  "duty-roster": "Duty Roster",
  settings: "Settings",
};

export default function AdminLayout({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const segment = location.pathname.split("/admin/")[1] || "dashboard";
  const active = segment.split("/")[0];

  const handleNavigate = (key) => {
    navigate(key === "dashboard" ? "/admin" : `/admin/${key}`);
    setSidebarOpen(false); // Close mobile drawer when route changes
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar with mobile drawer support */}
      <AdminSidebar
        active={active}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <AdminHeader
          title={TITLES[active] || "Dashboard"}
          userName={user?.name || "Admin"}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}