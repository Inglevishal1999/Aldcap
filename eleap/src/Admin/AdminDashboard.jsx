import React, { useEffect, useState } from "react";
import { useAdmin } from "./AdminContext";
import {
  Newspaper,
  PenTool,
  Image as ImageIcon,
  Zap,
  MessageSquare,
} from "lucide-react";
import API from "../Api/Axios.js";

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

export default function AdminDashboard() {
  const {
    news,
    blogs,
    gallery: contextGallery,
    services,
    messages,
  } = useAdmin();

  const [liveCounts, setLiveCounts] = useState({
    gallery: contextGallery.length,
    services: services.length,
    news: news.length,
    blogs: blogs.length,
    messages: messages.length,
  });

  const [recentUpdatesList, setRecentUpdatesList] = useState(() => {
    const saved = localStorage.getItem("admin_recent_updates");

    try {
      return saved ? JSON.parse(saved) : DEFAULT_UPDATES;
    } catch {
      return DEFAULT_UPDATES;
    }
  });

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  // Fetch actual gallery count from LIVE Render backend
  const fetchCounts = async () => {
    try {
      const galleryRes = await API.get("/gallery", {
        headers: {
          ...getAuthHeaders(),
        },
      });

      const galleryData = galleryRes?.data?.data;

      setLiveCounts((prev) => ({
        ...prev,
        gallery: Array.isArray(galleryData) ? galleryData.length : prev.gallery,
      }));
    } catch (err) {
      console.error(
        "Error fetching live gallery count:",
        err?.response?.data || err.message,
      );
    }
  };

  const syncRecentUpdates = () => {
    const saved = localStorage.getItem("admin_recent_updates");

    if (saved) {
      try {
        setRecentUpdatesList(JSON.parse(saved));
      } catch {
        setRecentUpdatesList(DEFAULT_UPDATES);
      }
    }
  };

  useEffect(() => {
    fetchCounts();
    syncRecentUpdates();

    const handleDataChange = () => {
      fetchCounts();
      syncRecentUpdates();
    };

    window.addEventListener("admin_data_changed", handleDataChange);

    window.addEventListener("recent_updates_changed", syncRecentUpdates);

    return () => {
      window.removeEventListener("admin_data_changed", handleDataChange);

      window.removeEventListener("recent_updates_changed", syncRecentUpdates);
    };
  }, []);

  const statCards = [
    {
      title: "News",
      value: news.length || liveCounts.news,
      icon: Newspaper,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Blogs",
      value: blogs.length || liveCounts.blogs,
      icon: PenTool,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Gallery",
      value: liveCounts.gallery,
      icon: ImageIcon,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Services",
      value: services.length || liveCounts.services,
      icon: Zap,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "Messages",
      value: messages.length || liveCounts.messages,
      icon: MessageSquare,
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">Welcome back, Admin 👋</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
        {statCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm"
            >
              <div
                className={`w-10 h-10 rounded-lg ${card.bgColor} ${card.textColor} flex items-center justify-center mb-4`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="text-3xl font-bold text-slate-900">
                {card.value}
              </div>

              <div className="text-sm font-medium text-slate-500 mt-1">
                {card.title}
              </div>
            </div>
          );
        })}
      </section>

      <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Recent Updates</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b">
              <tr>
                <th className="px-6 py-4">Content</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Last Updated</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentUpdatesList.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {item.content}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.actionBadge}`}
                    >
                      {item.action}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-500">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
