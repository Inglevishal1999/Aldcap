
import React, { useEffect, useState } from "react";
import { useAdmin } from "./AdminContext";
import {
  Newspaper,
  PenTool,
  Image as ImageIcon,
  Zap,
  MessageSquare,
  Search,
  Bell,
  Sun,
  Wind,
  Activity,
  TrendingUp,
  CalendarDays,
  ChevronDown,
  BatteryCharging,
  Gauge,
  CircleDollarSign,
  Menu,
} from "lucide-react";
import API from "../Api/Axios.js";

// ======================================================
// DEFAULT DATA
// ======================================================

const DEFAULT_UPDATES = [
  {
    content: "Services",
    action: "Updated",
    actionBadge: "bg-blue-50 text-blue-700",
    time: "2 days ago",
  },
  {
    content: "Gallery",
    action: "2 images added",
    actionBadge: "bg-purple-50 text-purple-700",
    time: "Yesterday",
  },
  {
    content: "Latest News",
    action: "Added",
    actionBadge: "bg-emerald-50 text-emerald-700",
    time: "2026-08-16",
  },
];

const productionData = [
  105, 140, 100, 215, 140, 270, 240, 185, 300, 75, 220, 170,
  25, 195, 75, 60, 280, 265, 180, 100, 140, 260, 170, 130,
  220, 30, 165, 195, 270, 55, 205,
];

const consumptionData = [
  235, 280, 230, 250, 285, 165, 85, 160, 125, 220, 100, 195,
  70, 240, 300, 115, 250, 185, 140, 70, 95, 150, 250, 210,
  95, 170, 255, 160, 110, 140, 205,
];

const MONTHS = [
  "Mar", "Apr", "May", "Jun", "Jul", "Aug",
];

// ======================================================
// ANIMATED NUMBER
// ======================================================

function AnimatedNumber({ value = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const duration = 1000;
    let startTime;

    let frame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 4);

      setCount(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{count.toLocaleString("en-IN")}</>;
}

// ======================================================
// SVG CHART
// ======================================================

function EnergyChart({ production, consumption }) {
  const width = 900;
  const height = 240;
  const left = 40;
  const right = 20;
  const top = 15;
  const bottom = 35;

  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const getX = (index, length) =>
    left + (index / (length - 1)) * chartWidth;

  const getY = (value) =>
    top + chartHeight - (value / 320) * chartHeight;

  const createPoints = (data) =>
    data.map((value, index) => ({
      x: getX(index, data.length),
      y: getY(value),
      value,
    }));

  const productionPoints = createPoints(production);
  const consumptionPoints = createPoints(consumption);

  const makePath = (points) =>
    points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
      )
      .join(" ");

  return (
    <div className="w-full overflow-hidden">
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[580px]"
          preserveAspectRatio="none"
          role="img"
          aria-label="Energy production and consumption chart"
        >
          {/* Grid */}

          {[0, 50, 100, 150, 200, 250, 300].map(
            (value) => {
              const y = getY(value);

              return (
                <g key={value}>
                  <line
                    x1={left}
                    y1={y}
                    x2={width - right}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="3 4"
                  />

                  <text
                    x={left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#64748b"
                  >
                    {value}
                  </text>
                </g>
              );
            }
          )}

          {/* Vertical grid */}

         

          {/* Production */}

          <path
            d={makePath(productionPoints)}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="5 5"
            className="chart-line"
          />

          {/* Consumption */}

          <path
            d={makePath(consumptionPoints)}
            fill="none"
            stroke="#eab308"
            strokeWidth="2"
            strokeDasharray="5 5"
            className="chart-line"
          />

          {/* Production points */}

          {productionPoints.map((point, index) => (
            <circle
              key={`p-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="1"
              className="chart-dot"
              style={{
                animationDelay: `${index * 25}ms`,
              }}
            >
              <title>
                Production: {point.value} kWh
              </title>
            </circle>
          ))}

          {/* Consumption points */}

          {consumptionPoints.map((point, index) => (
            <circle
              key={`c-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#eab308"
              stroke="#ffffff"
              strokeWidth="1"
              className="chart-dot"
              style={{
                animationDelay: `${index * 25}ms`,
              }}
            >
              <title>
                Consumption: {point.value} kWh
              </title>
            </circle>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ======================================================
// SOLAR ILLUSTRATION
// ======================================================

function SolarIllustration() {
  return (
    <div className="relative w-full h-full min-h-[260px] overflow-hidden">
      {/* Sun */}

      <div className="absolute top-5 right-10 w-20 h-20 bg-yellow-200 rounded-full opacity-80 animate-pulse" />

      {/* Clouds */}

      <div className="absolute top-12 left-10 text-slate-400/60">
        <Wind size={35} strokeWidth={1} />
      </div>

      <div className="absolute top-24 right-28 text-slate-400/60">
        <Wind size={26} strokeWidth={1} />
      </div>

      {/* Wind turbines */}

      <div className="absolute bottom-10 left-[38%] flex flex-col items-center">
        <div className="relative w-1 h-36 bg-slate-500 rounded-full">
          <div className="absolute -top-2 -left-[14px] w-8 h-8 turbine-blades">
            <div className="absolute top-0 left-[13px] w-1.5 h-4 bg-slate-600 rounded-full" />
            <div className="absolute bottom-0 left-[13px] w-1.5 h-4 bg-slate-600 rounded-full" />
            <div className="absolute top-[13px] left-0 w-4 h-1.5 bg-slate-600 rounded-full" />
            <div className="absolute top-[13px] right-0 w-4 h-1.5 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-[72%] flex flex-col items-center">
        <div className="relative w-1 h-28 bg-slate-500 rounded-full">
          <div className="absolute -top-2 -left-[14px] w-8 h-8 turbine-blades">
            <div className="absolute top-0 left-[13px] w-1.5 h-4 bg-slate-600 rounded-full" />
            <div className="absolute bottom-0 left-[13px] w-1.5 h-4 bg-slate-600 rounded-full" />
            <div className="absolute top-[13px] left-0 w-4 h-1.5 bg-slate-600 rounded-full" />
            <div className="absolute top-[13px] right-0 w-4 h-1.5 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* House */}

      <div className="absolute bottom-8 left-[48%] -translate-x-1/2">
        <div className="relative w-36 h-20 bg-white border-2 border-slate-500 rounded-sm">
          <div className="absolute -top-8 left-0 w-full h-8 bg-slate-300 border-2 border-slate-500 -skew-x-12" />

          <div className="grid grid-cols-3 gap-2 p-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-7 bg-amber-200 border border-slate-500"
              />
            ))}
          </div>

          <div className="absolute bottom-0 right-3 w-5 h-9 bg-amber-100 border border-slate-500" />
        </div>
      </div>

      {/* Solar panels */}

      <div className="absolute bottom-8 left-2 flex gap-2">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="w-12 h-7 bg-slate-700 border-2 border-white rounded-sm solar-panel"
            style={{
              transform: `skewX(-20deg)`,
              animationDelay: `${n * 150}ms`,
            }}
          >
            <div className="grid grid-cols-3 h-full">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="border-r border-yellow-300/70"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ground */}

      <div className="absolute bottom-0 left-0 w-full h-8 bg-emerald-100 rounded-b-2xl" />
    </div>
  );
}

// ======================================================
// MAIN DASHBOARD
// ======================================================

export default function AdminDashboard() {
  const {
    news = [],
    blogs = [],
    gallery: contextGallery = [],
    services = [],
    messages = [],
  } = useAdmin();

  const [liveCounts, setLiveCounts] = useState({
    gallery: contextGallery.length,
    services: services.length,
    news: news.length,
    blogs: blogs.length,
    messages: messages.length,
  });

  const [recentUpdatesList, setRecentUpdatesList] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          "admin_recent_updates"
        );

        return saved
          ? JSON.parse(saved)
          : DEFAULT_UPDATES;
      } catch {
        return DEFAULT_UPDATES;
      }
    });

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("Monthly");

  // Energy values are demonstration values until connected
  // to a real solar monitoring API.

  const [energy, setEnergy] = useState({
    capacity: 320,
    today: 190,
    consumption: 205,
    total: 10090,
    loss: 12.54,
  });

  // --------------------------------------
  // FETCH LIVE GALLERY COUNT
  // --------------------------------------

  const fetchCounts = async () => {
    try {
      const galleryRes = await API.get("/gallery");

      const galleryData = galleryRes?.data?.data;

      setLiveCounts((prev) => ({
        ...prev,
        gallery: Array.isArray(galleryData)
          ? galleryData.length
          : prev.gallery,
      }));
    } catch (err) {
      console.error(
        "Error fetching gallery count:",
        err?.response?.data || err.message
      );
    }
  };

  // --------------------------------------
  // RECENT UPDATES
  // --------------------------------------

  const syncRecentUpdates = () => {
    try {
      const saved = localStorage.getItem(
        "admin_recent_updates"
      );

      setRecentUpdatesList(
        saved ? JSON.parse(saved) : DEFAULT_UPDATES
      );
    } catch {
      setRecentUpdatesList(DEFAULT_UPDATES);
    }
  };

  useEffect(() => {
    fetchCounts();
    syncRecentUpdates();

    const handleDataChange = () => {
      fetchCounts();
      syncRecentUpdates();
    };

    window.addEventListener(
      "admin_data_changed",
      handleDataChange
    );

    window.addEventListener(
      "recent_updates_changed",
      syncRecentUpdates
    );

    return () => {
      window.removeEventListener(
        "admin_data_changed",
        handleDataChange
      );

      window.removeEventListener(
        "recent_updates_changed",
        syncRecentUpdates
      );
    };
  }, []);

  // --------------------------------------
  // DASHBOARD STAT CARDS
  // --------------------------------------

  const statCards = [
    {
      title: "News",
      value: news.length || liveCounts.news,
      icon: Newspaper,
      color: "from-blue-500 to-indigo-600",
      light: "bg-blue-50",
      text: "text-blue-600",
      change: "+12%",
    },
    {
      title: "Blogs",
      value: blogs.length || liveCounts.blogs,
      icon: PenTool,
      color: "from-emerald-500 to-teal-600",
      light: "bg-emerald-50",
      text: "text-emerald-600",
      change: "+8%",
    },
    {
      title: "Gallery",
      value: liveCounts.gallery,
      icon: ImageIcon,
      color: "from-purple-500 to-violet-600",
      light: "bg-purple-50",
      text: "text-purple-600",
      change: "+18%",
    },
    {
      title: "Services",
      value: services.length || liveCounts.services,
      icon: Zap,
      color: "from-amber-400 to-orange-500",
      light: "bg-amber-50",
      text: "text-amber-600",
      change: "+5%",
    },
    {
      title: "Messages",
      value: messages.length || liveCounts.messages,
      icon: MessageSquare,
      color: "from-rose-500 to-pink-600",
      light: "bg-rose-50",
      text: "text-rose-600",
      change: "New",
    },
  ];

  // --------------------------------------
  // SEARCH
  // --------------------------------------

  const filteredUpdates = recentUpdatesList.filter(
    (item) =>
      item.content
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.action
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // --------------------------------------
  // RENDER
  // --------------------------------------

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-800 font-sans">

      

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">

        {/* WELCOME */}

        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back, Admin 👋
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Here's what's happening with your energy
              dashboard today.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
            <CalendarDays
              size={17}
              className="text-emerald-600"
            />

            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </section>

        {/* STAT CARDS */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="dashboard-card group relative overflow-hidden bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-[0.07] -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700`}
                />

                <div className="flex justify-between items-center">
                  <div
                    className={`w-12 h-12 rounded-2xl ${card.light} ${card.text} flex items-center justify-center group-hover:rotate-6 transition-transform duration-300`}
                  >
                    <Icon size={23} />
                  </div>

                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {card.change}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-1">
                    <AnimatedNumber value={card.value} />
                  </h3>
                </div>

                <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-linear-to-r ${card.color} progress-animate`}
                    style={{
                      animationDelay: `${index * 200}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </section>


        {/* RECENT UPDATES */}

        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 sm:p-7 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Recent Updates
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Latest activity across your admin portal.
              </p>
            </div>

            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-3 py-2">
              {filteredUpdates.length} Activities
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 sm:px-7 py-4 font-semibold">
                    Content
                  </th>

                  <th className="px-5 sm:px-7 py-4 font-semibold">
                    Action
                  </th>

                  <th className="px-5 sm:px-7 py-4 font-semibold">
                    Last Updated
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUpdates.length > 0 ? (
                  filteredUpdates.map((item, index) => (
                    <tr
                      key={`${item.content}-${index}`}
                      className="hover:bg-emerald-50/40 transition-colors"
                    >
                      <td className="px-5 sm:px-7 py-5 font-semibold text-slate-800">
                        {item.content}
                      </td>

                      <td className="px-5 sm:px-7 py-5">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            item.actionBadge ||
                            "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {item.action}
                        </span>
                      </td>

                      <td className="px-5 sm:px-7 py-5 text-slate-500 whitespace-nowrap">
                        {item.time}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No recent updates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="flex flex-col sm:flex-row justify-between items-center gap-2 py-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} ALDC Energy.
            All rights reserved.
          </p>

          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Admin Dashboard
          </p>
        </footer>
      </main>

      {/* ANIMATIONS */}

      <style>{`
        .dashboard-card {
          animation: cardEntrance 650ms ease-out both;
        }

        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .progress-animate {
          animation: progressGrow 1.5s ease-out both;
          transform-origin: left;
        }

        @keyframes progressGrow {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .chart-line {
          stroke-dasharray: 1500;
          stroke-dashoffset: 1500;
          animation: drawLine 2.5s ease forwards;
        }

        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }

        .chart-dot {
          opacity: 0;
          animation: dotAppear 500ms ease forwards;
        }

        @keyframes dotAppear {
          from {
            opacity: 0;
            transform: scale(0);
            transform-origin: center;
          }
          to {
            opacity: 1;
            transform: scale(1);
            transform-origin: center;
          }
        }

        .turbine-blades {
          animation: turbineSpin 5s linear infinite;
          transform-origin: center;
        }

        @keyframes turbineSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .bar-animate {
          animation: barEntrance 1s ease-out both;
          transform-origin: bottom;
        }

        @keyframes barEntrance {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }

        .solar-panel {
          animation: panelGlow 3s ease-in-out infinite alternate;
        }

        @keyframes panelGlow {
          from {
            filter: brightness(0.95);
          }
          to {
            filter: brightness(1.2);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

