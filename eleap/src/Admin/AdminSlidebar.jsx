import { useState } from "react";
import {
  LayoutDashboard,
  ChevronDown,
  Images,
  Info,
  Wrench,
  ShieldCheck,
  Zap,
  GalleryHorizontal,
  Newspaper,
  BookOpen,
  Briefcase,
  MessageSquare,
  CalendarClock,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const websiteItems = [
  { key: "hero-slider", label: "Hero Slider", icon: Images },
  { key: "about", label: "About", icon: Info },
  { key: "services", label: "Services", icon: Wrench },
  { key: "safety", label: "Safety", icon: ShieldCheck },
  { key: "power-stations", label: "Power Stations", icon: Zap },
  { key: "gallery", label: "Gallery", icon: GalleryHorizontal },
  { key: "news", label: "News", icon: Newspaper },
  { key: "blog", label: "Blog", icon: BookOpen },
  { key: "careers", label: "Careers", icon: Briefcase },
];

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex w-full items-center gap-3 rounded-xl
        px-3 py-2.5 text-sm font-medium
        transition-colors duration-150
        ${
          active
            ? "bg-yellow-400 text-blue-950 shadow-sm shadow-yellow-900/20"
            : "text-blue-200 hover:bg-white/6 hover:text-white"
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

function SectionLabel({ children, open, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="
        flex w-full items-center justify-between
        rounded-lg px-3 pb-2 pt-5
        text-xs font-bold uppercase tracking-[0.15em]
        text-blue-400
        transition-colors hover:text-blue-200
      "
    >
      {children}

      <ChevronDown
        className={`h-3.5 w-3.5 transition-transform duration-200 ${
          open ? "rotate-0" : "-rotate-90"
        }`}
      />
    </button>
  );
}

export default function AdminSidebar({
  active = "dashboard",
  isOpen = false,
  onClose = () => {},
  onNavigate = () => {},
  onLogout = () => {},
}) {
  const [websiteOpen, setWebsiteOpen] = useState(true);

  return (
    <>
      {/* =========================================================
          MOBILE BACKDROP
      ========================================================= */}
      {isOpen && (
        <div
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-black/50
            transition-opacity
            lg:hidden
          "
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-64 min-h-0 flex-col
          bg-[#111f5c] text-white

          transform
          transition-transform duration-300 ease-in-out

          lg:static
          lg:translate-x-0

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* =======================================================
            LOGO / HEADER
        ======================================================= */}
        <div className="flex shrink-0 items-center justify-between px-5 pb-4 pt-6">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 fill-yellow-400 text-yellow-400" />

              <span className="text-sm font-extrabold tracking-[0.2em] text-white">
                ALDC ENERGY
              </span>
            </div>

            <p className="mt-1 pl-6 text-[11px] font-semibold tracking-[0.25em] text-blue-300">
              ADMIN PANEL
            </p>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="
              rounded-lg p-1
              text-blue-300
              hover:bg-white/10
              hover:text-white
              lg:hidden
            "
            aria-label="Close menu"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Header separator */}
        <div className="mx-5 shrink-0 border-t border-white/10" />

        {/* =======================================================
            SCROLLABLE NAVIGATION
        ======================================================= */}
        <nav
          className="
            scrollbar-none
            min-h-0
            flex-1
            overflow-y-auto
            px-3
            pb-4
          "
        >
          {/* Dashboard */}
          <div className="pt-4">
            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={active === "dashboard"}
              onClick={() => onNavigate("dashboard")}
            />
          </div>

          {/* =====================================================
              WEBSITE
          ===================================================== */}
          <SectionLabel
            open={websiteOpen}
            onToggle={() => setWebsiteOpen((v) => !v)}
          >
            Website
          </SectionLabel>

          {websiteOpen && (
            <div className="space-y-0.5">
              {websiteItems.map((item) => (
                <NavItem
                  key={item.key}
                  icon={item.icon}
                  label={item.label}
                  active={active === item.key}
                  onClick={() => onNavigate(item.key)}
                />
              ))}
            </div>
          )}

          {/* =====================================================
              COMMUNICATION
          ===================================================== */}
          <SectionLabel open={true} onToggle={() => {}}>
            Communication
          </SectionLabel>

          <NavItem
            icon={MessageSquare}
            label="Messages"
            active={active === "messages"}
            onClick={() => onNavigate("messages")}
          />

          {/* =====================================================
              WORKFORCE
          ===================================================== */}
          <SectionLabel open={true} onToggle={() => {}}>
            Workforce
          </SectionLabel>

          <NavItem
            icon={CalendarClock}
            label="Duty Roster"
            active={active === "duty-roster"}
            onClick={() => onNavigate("duty-roster")}
          />
        </nav>

        {/* =======================================================
            FOOTER
            This section will NOT shrink.
        ======================================================= */}
        <div className="mx-5 shrink-0 border-t border-white/10" />

        <div
          className="
            shrink-0
            space-y-0.5
            px-3
            py-4
          "
        >
          {/* Settings */}
          <NavItem
            icon={Settings}
            label="Settings"
            active={active === "settings"}
            onClick={() => onNavigate("settings")}
          />

          {/* =====================================================
              LOGOUT
          ===================================================== */}
          <button
            type="button"
            onClick={onLogout}
            className="
              flex w-full items-center gap-3
              rounded-xl
              px-3 py-2.5
              text-sm font-medium
              text-red-300
              transition-colors
              hover:bg-red-500/10
              hover:text-red-200
            "
          >
            <LogOut className="h-4 w-4 shrink-0" />

            <span className="truncate">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}