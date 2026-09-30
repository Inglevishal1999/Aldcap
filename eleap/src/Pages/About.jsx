import React, { useState, useRef, useEffect } from "react";

// Local assets (adjust paths if your folder structure differs)
import DefaultAboutImage from "../assets/about.jpeg";
import DefaultMissionImage from "../assets/about2.jpg";
import DefaultBuildingImage from "../assets/bloghome.jpeg";

const DEFAULT_IMAGES = {
  about: DefaultAboutImage,
  mission: DefaultMissionImage,
  vision: DefaultBuildingImage,
};

// Toast message options for the IT Help Desk button.
// To switch messages, change the key in ACTIVE_TOAST below.
const TOAST_OPTIONS = {
  wip: {
    icon: "🚧",
    title: "IT Help Desk — Work in Progress",
    text: "This feature is currently being set up. For urgent issues, please email portal-help@aldcenergy.com.",
  },
  comingSoon: {
    icon: "🛠️",
    title: "Help Desk Coming Soon",
    text: "Online ticket submission will be available shortly. Thank you for your patience.",
  },
  maintenance: {
    icon: "⚙️",
    title: "Help Desk Under Maintenance",
    text: "The ticket system is being upgraded. Please contact the IT team by email in the meantime.",
  },
  contact: {
    icon: "📧",
    title: "Contact IT Support",
    text: "Email portal-help@aldcenergy.com or use Field Dispatch Radio Link 7-B for urgent issues.",
  },
  received: {
    icon: "✅",
    title: "Request Noted",
    text: "Your help desk request has been logged. The IT team will get back to you soon.",
  },
};
const ACTIVE_TOAST = "comingSoon"; // wip | comingSoon | maintenance | contact | received

/**
 * @param {Object} props
 * @param {Object} [props.adminImages] - Dynamic image URLs assigned via the Admin Portal database
 * @param {string} [props.adminImages.about]
 * @param {string} [props.adminImages.mission]
 * @param {string} [props.adminImages.vision]
 */
export default function AldcAboutPortalLayout({ adminImages }) {
  const [activeTab, setActiveTab] = useState("about");
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef(null);

  // Clear any pending timer when the component unmounts
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleSupportClick = () => {
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    // Auto-dismiss after 4 seconds
    toastTimer.current = setTimeout(() => setShowToast(false), 4000);
  };

  /** ADMINISTRATIVE CONTENT CONFIGURATION SCHEMA */
  const adminContentSchema = {
    about: {
      headline: "Powering Our Workforce with Reliability",
      title: "Welcome to the ALDC Control Hub",
      text: "The ALDC Employee Portal serves as our unified internal corporate architecture. Managed directly by the System Admin Team, this secure workspace unifies our remote distribution engineers, localized substation crews, and administrative office operations into one integrated framework.",
      imageUrl: adminImages?.about || DefaultAboutImage,
      imageAlt: "ALDC Grid Control Center Map Layout",
      badgeText: "SYSTEM OVERVIEW",
    },
    mission: {
      headline: "Powering Safe Operations with Reliability",
      title: "Our Operational Mission Directive",
      text: "To safely, reliably, and efficiently manage critical electrical distribution networks. We arm our ground technicians and grid operators with real-time analytics, minimizing grid downtime and standardizing absolute safety parameters across all fields.",
      imageUrl: adminImages?.mission || DefaultMissionImage,
      imageAlt: "Field Crew Safety Operations & Distribution",
      badgeText: "SAFETY FIRST",
    },
    vision: {
      headline: "Powering Tomorrow's Grid with Reliability",
      title: "Our Digital Future Vision Plan",
      text: "Building an interconnected digital grid workspace. We aim to achieve seamless telemetry tracking, instantaneous safety logging architectures, and comprehensive administrative transparency for all field and corporate staff.",
      imageUrl: adminImages?.vision || DefaultBuildingImage,
      imageAlt: "Future Digital Substation Telemetry Technology",
      badgeText: "ALDC NEXT-GEN",
    },
  };

  const active = adminContentSchema[activeTab];
  const toast = TOAST_OPTIONS[ACTIVE_TOAST];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 font-sans bg-white min-h-screen text-slate-800 relative">
      {/* TOAST NOTIFICATION (fixed bottom-right) */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-5 right-5 z-50 transform transition-all duration-300 ease-out ${
          showToast
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-700/50 max-w-sm flex items-start gap-3">
          <span className="text-[#ffb703] text-lg mt-0.5">{toast.icon}</span>
          <div>
            <h5 className="font-bold text-sm text-[#ffb703]">{toast.title}</h5>
            <p className="text-xs text-slate-300 mt-1 leading-normal">
              {toast.text}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-white font-bold ml-2 text-xs"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. Top Title & Category Label */}
      <div className="pt-2 pb-1">
        <div className="inline-block">
          <span className="text-[#002b9a] uppercase font-bold tracking-widest text-xs sm:text-sm block">
            About Section
          </span>
          <div className="h-1 w-12 bg-[#ffb703] mt-1"></div>
        </div>

        <h1 className="text-[#002b9a] text-3xl sm:text-4xl md:text-5xl font-extrabold mt-4 sm:mt-6 mb-2 tracking-tight leading-tight">
          Powering Our Workforce <br className="hidden sm:inline" />
          <span className="text-[#ffb703]">with Reliability</span>
        </h1>
      </div>

      {/* 3. Horizontal Pill Tabs */}
      <div
        role="tablist"
        aria-label="About sections"
        className="flex flex-wrap gap-2 my-6 bg-slate-100 p-1.5 rounded-2xl sm:rounded-full w-full sm:w-max border border-slate-200/60 shadow-inner"
      >
        {Object.keys(adminContentSchema).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-initial text-center px-4 sm:px-6 py-2 rounded-xl sm:rounded-full font-bold text-xs sm:text-sm transition-all duration-200 capitalize ${
              activeTab === tab
                ? "bg-[#002b9a] text-white shadow-md"
                : "text-slate-600 hover:text-[#002b9a] hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4. Full-Width Dynamic Image Block */}
      <div className="relative overflow-hidden w-full h-48 sm:h-72 md:h-100 rounded-xl shadow-lg border border-slate-200 bg-slate-900 transition-all duration-300">
        <img
          src={active.imageUrl}
          alt={active.imageAlt}
          onError={(e) => {
            // Prevent infinite error loop, then use local fallback
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_IMAGES[activeTab];
          }}
          className="w-full h-full object-cover filter brightness-90"
        />

        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>

        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-slate-900/85 backdrop-blur-sm border border-white/20 text-[#ffb703] font-mono text-[9px] sm:text-[10px] font-bold tracking-widest px-2.5 py-1 rounded shadow-sm">
          {active.badgeText}
        </div>

        <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-6 right-4 z-10">
          <span className="text-white text-lg sm:text-2xl font-black block tracking-wide drop-shadow-md">
            ALDC Energy Infrastructure
          </span>
          <span className="text-[10px] sm:text-xs text-slate-300 font-medium tracking-wider block opacity-90 truncate">
            Current Display: {active.imageAlt}
          </span>
        </div>
      </div>

      {/* 5. Dynamic Informational Content */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Left Copy Panel */}
        <div className="md:col-span-8 space-y-4">
          <h3 className="text-[#002b9a] font-black text-xl sm:text-2xl tracking-tight">
            {active.title}
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            {active.text}
          </p>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-[#002b9a] font-bold text-sm sm:text-base mb-3">
              🛠️ Connected Portal Resource Modules:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <strong>⚡ Grid Tracking:</strong> Real-time outage logging maps.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <strong>🛡️ Safety Hub:</strong> OSHA compliance check-ins.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <strong>👥 Workforce Log:</strong> Timesheets and self-service
                payroll.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <strong>📢 Admin Control:</strong> System status configurations.
              </div>
            </div>
          </div>
        </div>

        {/* Right Admin Contact & Help Desk Panel */}
        <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4 w-full">
          <div>
            <h4 className="text-[#002b9a] font-bold text-sm sm:text-base mb-1">
              📢 Portal Administration
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Environment refreshed weekly on Tuesdays at 01:00 UTC by the Web
              Admin Group.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSupportClick}
            className="w-full text-center bg-[#002b9a] hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-lg text-xs sm:text-sm shadow-md transition-all duration-150 active:scale-[0.98]"
          >
            Open System IT Help Desk
          </button>

          <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
            <p>
              📍 Admin Support:{" "}
              <a
                href="mailto:portal-help@aldcenergy.com"
                className="text-[#002b9a] font-semibold underline"
              >
                portal-help@aldcenergy.com
              </a>
            </p>
            <p>📻 Field Dispatch Channel: Radio Link 7-B</p>
          </div>
        </div>
      </div>

      {/* 6. Legal & System Footer */}
      <footer className="mt-10 pt-4 border-t border-slate-200 text-center text-[10px] sm:text-xs text-slate-500">
        Strictly Confidential — Internal System Use Only • ALDC Energy Portal
        v4.2.1 • © 2026 ALDC Energy Network.
      </footer>
    </div>
  );
}