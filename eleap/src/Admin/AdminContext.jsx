
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

// =====================================================
// ADMIN CONTEXT
// =====================================================

const AdminContext = createContext(null);

// =====================================================
// DEFAULT RECENT UPDATES
// =====================================================

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

// =====================================================
// LOCAL STORAGE KEY
// =====================================================

const RECENT_UPDATES_KEY = "admin_recent_updates";

// =====================================================
// SAFE LOCAL STORAGE READER
// =====================================================

const getSavedUpdates = () => {
  try {
    const saved = localStorage.getItem(RECENT_UPDATES_KEY);

    if (!saved) {
      return DEFAULT_UPDATES;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : DEFAULT_UPDATES;
  } catch (error) {
    console.error(
      "Failed to read admin recent updates:",
      error
    );

    return DEFAULT_UPDATES;
  }
};

// =====================================================
// ADMIN PROVIDER
// =====================================================

export function AdminProvider({ children }) {
  // ---------------------------------------------------
  // Recent activity
  // ---------------------------------------------------

  const [recentUpdates, setRecentUpdates] =
    useState(getSavedUpdates);

  // ===================================================
  // LOG ADMIN ACTIVITY
  // ===================================================

  const logActivity = useCallback(
    (content, action, actionBadge) => {
      const today = new Date();

      const formattedDate =
        `${today.getFullYear()}-` +
        `${String(today.getMonth() + 1).padStart(2, "0")}-` +
        `${String(today.getDate()).padStart(2, "0")}`;

      const newEntry = {
        content,
        action,
        actionBadge,
        time: formattedDate,
      };

      setRecentUpdates((previousUpdates) => {
        const updatedList = [
          newEntry,
          ...previousUpdates.slice(0, 4),
        ];

        try {
          localStorage.setItem(
            RECENT_UPDATES_KEY,
            JSON.stringify(updatedList)
          );
        } catch (error) {
          console.error(
            "Failed to save admin activity:",
            error
          );
        }

        return updatedList;
      });

      // Notify other components/tabs that activity changed
      window.dispatchEvent(
        new Event("recent_updates_changed")
      );
    },
    []
  );

  // ===================================================
  // LISTEN FOR ACTIVITY CHANGES
  // ===================================================

  React.useEffect(() => {
    const handleRecentUpdatesChange = () => {
      setRecentUpdates(getSavedUpdates());
    };

    window.addEventListener(
      "recent_updates_changed",
      handleRecentUpdatesChange
    );

    return () => {
      window.removeEventListener(
        "recent_updates_changed",
        handleRecentUpdatesChange
      );
    };
  }, []);

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const contextValue = {
    recentUpdates,
    logActivity,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error(
      "useAdmin must be used inside an AdminProvider"
    );
  }

  return context;
};
