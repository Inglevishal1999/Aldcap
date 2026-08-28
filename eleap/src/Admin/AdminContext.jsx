import React, { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

const DEFAULT_UPDATES = [
  { content: "Services", action: "Updated", actionBadge: "bg-blue-50 text-blue-700", time: "2 days ago" },
  { content: "Gallery", action: "2 images added", actionBadge: "bg-purple-50 text-purple-700", time: "Yesterday" },
  { content: "Latest News", action: "Added", actionBadge: "bg-emerald-50 text-emerald-700", time: "2026-08-16" },
];

export function AdminProvider({ children }) {
  const [news] = useState([
    { id: 1, title: "MSEDCL Tariff Adjustment", date: "2026-08-16", status: "Published" },
  ]);
  const [blogs] = useState([]);
  const [gallery] = useState([]);
  const [services] = useState([
    { id: 1, title: "Technical" },
    { id: 2, title: "Monitoring" },
    { id: 3, title: "Substation" },
    { id: 4, title: "Safety" },
    { id: 5, title: "Maintenance" },
    { id: 6, title: "Power Supply" },
  ]);
  const [messages] = useState([]);

  // Load initial updates from localStorage or fall back to defaults
  const [recentUpdates, setRecentUpdates] = useState(() => {
    const saved = localStorage.getItem("admin_recent_updates");
    return saved ? JSON.parse(saved) : DEFAULT_UPDATES;
  });

  // Listen for storage changes across tabs or pages
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("admin_recent_updates");
      if (saved) setRecentUpdates(JSON.parse(saved));
    };
    window.addEventListener("recent_updates_changed", handleStorageChange);
    return () => window.removeEventListener("recent_updates_changed", handleStorageChange);
  }, []);

  // Function to log new actions into localStorage & update React state
  const logActivity = (content, action, actionBadge) => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const newEntry = {
      content,
      action,
      actionBadge,
      time: formattedDate,
    };

    setRecentUpdates((prev) => {
      const updatedList = [newEntry, ...prev.slice(0, 4)];
      localStorage.setItem("admin_recent_updates", JSON.stringify(updatedList));
      return updatedList;
    });

    window.dispatchEvent(new Event("recent_updates_changed"));
  };

  return (
    <AdminContext.Provider
      value={{
        news,
        blogs,
        gallery,
        services,
        messages,
        recentUpdates,
        logActivity,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);