
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Newspaper,
  PenTool,
  Image as ImageIcon,
  Zap,
  MessageSquare,
  CalendarDays,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "./AdminContext";
import API from "../Api/Axios.js";

// ======================================================
// CONSTANTS
// ======================================================

const PREVIEW_LIMIT = 4;

const API_ORIGIN = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://elaap-backend-live.onrender.com";

// ======================================================
// HELPERS
// ======================================================

function extractArray(response) {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

function getDateValue(item) {
  return (
    item?.createdAt ||
    item?.updatedAt ||
    item?.publishedAt ||
    item?.date ||
    item?.created_at ||
    item?.updated_at ||
    null
  );
}

function sortNewest(items = []) {
  return [...items].sort((a, b) => {
    const dateA = new Date(getDateValue(a) || 0).getTime();
    const dateB = new Date(getDateValue(b) || 0).getTime();

    return dateB - dateA;
  });
}

function formatDate(date) {
  if (!date) return "Recently";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getItemId(item, index) {
  return (
    item?._id ||
    item?.id ||
    item?.slug ||
    `${item?.title || item?.name || "item"}-${index}`
  );
}

function getItemTitle(item, fallback = "Untitled") {
  return (
    item?.title ||
    item?.name ||
    item?.caption ||
    item?.headline ||
    fallback
  );
}

function resolveImage(image) {
  if (!image) {
    return null;
  }

  if (typeof image === "object") {
    image =
      image?.url ||
      image?.secure_url ||
      image?.path ||
      image?.src ||
      "";
  }

  if (!image || typeof image !== "string") {
    return null;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `${API_ORIGIN}${image}`;
  }

  if (image.startsWith("uploads/")) {
    return `${API_ORIGIN}/${image}`;
  }

  return image;
}

// ======================================================
// ANIMATED NUMBER
// ======================================================

function AnimatedNumber({ value = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const duration = 900;

    let startTime = null;
    let frame;

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

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

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [value]);

  return <>{count.toLocaleString("en-IN")}</>;
}

// ======================================================
// LOADING SKELETON
// ======================================================

function PreviewSkeleton({ image = false }) {
  return (
    <div className="animate-pulse">
      {image ? (
        <div className="w-full h-32 rounded-xl bg-slate-200" />
      ) : (
        <div className="h-16 rounded-xl bg-slate-100" />
      )}
    </div>
  );
}

// ======================================================
// MAIN DASHBOARD
// ======================================================

export default function AdminDashboard() {
  const {
    messages = [],
  } = useAdmin();

  // ----------------------------------------------------
  // DATA STATES
  // ----------------------------------------------------

  const [news, setNews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // ----------------------------------------------------
  // FETCH DASHBOARD DATA
  // ----------------------------------------------------

  const fetchDashboardData = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const [
          newsResult,
          blogsResult,
          galleryResult,
          servicesResult,
        ] = await Promise.allSettled([
          API.get("/news/admin"),
          API.get("/blogs/admin/all"),
          API.get("/gallery"),
          API.get("/services"),
        ]);

        // ----------------------------------------------
        // NEWS
        // ----------------------------------------------

        if (newsResult.status === "fulfilled") {
          const newsData = extractArray(
            newsResult.value
          );

          setNews(sortNewest(newsData));
        } else {
          console.error(
            "Error fetching news:",
            newsResult.reason?.response?.data ||
              newsResult.reason
          );

          setNews([]);
        }

        // ----------------------------------------------
        // BLOGS
        // ----------------------------------------------

        if (blogsResult.status === "fulfilled") {
          const blogsData = extractArray(
            blogsResult.value
          );

          setBlogs(sortNewest(blogsData));
        } else {
          console.error(
            "Error fetching blogs:",
            blogsResult.reason?.response?.data ||
              blogsResult.reason
          );

          setBlogs([]);
        }

        // ----------------------------------------------
        // GALLERY
        // ----------------------------------------------

        if (galleryResult.status === "fulfilled") {
          const galleryData = extractArray(
            galleryResult.value
          );

          setGallery(sortNewest(galleryData));
        } else {
          console.error(
            "Error fetching gallery:",
            galleryResult.reason?.response?.data ||
              galleryResult.reason
          );

          setGallery([]);
        }

        // ----------------------------------------------
        // SERVICES
        // ----------------------------------------------

        if (servicesResult.status === "fulfilled") {
          const response = servicesResult.value;

          const servicesData = extractArray(response);

          /*
           * Your backend returns:
           *
           * {
           *   success: true,
           *   count: 6,
           *   data: [...]
           * }
           *
           * We still use data.length for the actual array,
           * so the dashboard remains reliable even if the
           * response format changes.
           */

          setServices(sortNewest(servicesData));

          console.log(
            "Services fetched:",
            response?.data?.count ??
              servicesData.length
          );
        } else {
          console.error(
            "Error fetching services:",
            servicesResult.reason?.response?.data ||
              servicesResult.reason
          );

          setServices([]);
        }

        // ----------------------------------------------
        // ERROR MESSAGE
        // ----------------------------------------------

        const failedRequests = [
          newsResult,
          blogsResult,
          galleryResult,
          servicesResult,
        ].filter(
          (result) => result.status === "rejected"
        );

        if (failedRequests.length > 0) {
          setError(
            "Some dashboard data could not be loaded. Please check the console or refresh."
          );
        }
      } catch (err) {
        console.error(
          "Dashboard data error:",
          err?.response?.data || err
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // ----------------------------------------------------
  // INITIAL LOAD
  // ----------------------------------------------------

  useEffect(() => {
    fetchDashboardData(false);

    const handleDataChange = () => {
      fetchDashboardData(true);
    };

    window.addEventListener(
      "admin_data_changed",
      handleDataChange
    );

    return () => {
      window.removeEventListener(
        "admin_data_changed",
        handleDataChange
      );
    };
  }, [fetchDashboardData]);

  // ======================================================
  // COUNTS
  // ======================================================

  const counts = {
    news: news.length,
    blogs: blogs.length,
    gallery: gallery.length,
    services: services.length,
    messages: messages.length,
  };

  // ======================================================
  // STAT CARDS
  // ======================================================

  const statCards = [
    {
      title: "News",
      value: counts.news,
      icon: Newspaper,
      color: "from-blue-500 to-indigo-600",
      light: "bg-blue-50",
      text: "text-blue-600",
      change: "Live",
    },
    {
      title: "Blogs",
      value: counts.blogs,
      icon: PenTool,
      color: "from-emerald-500 to-teal-600",
      light: "bg-emerald-50",
      text: "text-emerald-600",
      change: "Live",
    },
    {
      title: "Gallery",
      value: counts.gallery,
      icon: ImageIcon,
      color: "from-purple-500 to-violet-600",
      light: "bg-purple-50",
      text: "text-purple-600",
      change: "Live",
    },
    {
      title: "Services",
      value: counts.services,
      icon: Zap,
      color: "from-amber-400 to-orange-500",
      light: "bg-amber-50",
      text: "text-amber-600",
      change: "Live",
    },
    {
      title: "Messages",
      value: counts.messages,
      icon: MessageSquare,
      color: "from-rose-500 to-pink-600",
      light: "bg-rose-50",
      text: "text-rose-600",
      change: "Live",
    },
  ];

  // ======================================================
  // LATEST 4 ITEMS
  // ======================================================

  const latestNews = news.slice(0, PREVIEW_LIMIT);
  const latestBlogs = blogs.slice(0, PREVIEW_LIMIT);
  const latestServices = services.slice(
    0,
    PREVIEW_LIMIT
  );
  const latestGallery = gallery.slice(
    0,
    PREVIEW_LIMIT
  );

  // ======================================================
  // RECENT UPDATES
  // ======================================================

  const recentUpdates = useMemo(() => {
    const updates = [];

    latestNews.forEach((item, index) => {
      updates.push({
        id: `news-${getItemId(item, index)}`,
        content: getItemTitle(
          item,
          "News"
        ),
        action: "News updated",
        badge:
          "bg-blue-50 text-blue-700",
        date: getDateValue(item),
      });
    });

    latestBlogs.forEach((item, index) => {
      updates.push({
        id: `blog-${getItemId(item, index)}`,
        content: getItemTitle(
          item,
          "Blog"
        ),
        action: "Blog updated",
        badge:
          "bg-emerald-50 text-emerald-700",
        date: getDateValue(item),
      });
    });

    latestServices.forEach((item, index) => {
      updates.push({
        id: `service-${getItemId(item, index)}`,
        content: getItemTitle(
          item,
          "Service"
        ),
        action: "Service updated",
        badge:
          "bg-amber-50 text-amber-700",
        date: getDateValue(item),
      });
    });

    latestGallery.forEach((item, index) => {
      updates.push({
        id: `gallery-${getItemId(item, index)}`,
        content: getItemTitle(
          item,
          "Gallery"
        ),
        action: "Gallery updated",
        badge:
          "bg-purple-50 text-purple-700",
        date: getDateValue(item),
      });
    });

    return updates
      .sort((a, b) => {
        const dateA = new Date(
          a.date || 0
        ).getTime();

        const dateB = new Date(
          b.date || 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 10);
  }, [
    latestNews,
    latestBlogs,
    latestServices,
    latestGallery,
  ]);

  // ======================================================
  // SEARCH
  // ======================================================

  const filteredUpdates = recentUpdates.filter(
    (item) => {
      const query = search
        .toLowerCase()
        .trim();

      if (!query) {
        return true;
      }

      return (
        item.content
          ?.toLowerCase()
          .includes(query) ||
        item.action
          ?.toLowerCase()
          .includes(query)
      );
    }
  );

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-800 font-sans">

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">

        {/* ==================================================
            WELCOME
        ================================================== */}

        <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back, Admin 👋
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Here's what's happening with your
              energy dashboard today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <div className="flex items-center gap-2 text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
              <CalendarDays
                size={17}
                className="text-emerald-600"
              />

              {new Date().toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                fetchDashboardData(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 transition"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </section>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {/* ==================================================
            STAT CARDS
        ================================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

          {statCards.map(
            (card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="dashboard-card group relative overflow-hidden bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{
                    animationDelay: `${
                      index * 100
                    }ms`,
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
                      {loading ? (
                        <span className="inline-block w-10 h-8 bg-slate-200 rounded animate-pulse" />
                      ) : (
                        <AnimatedNumber
                          value={card.value}
                        />
                      )}
                    </h3>

                  </div>

                  <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">

                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${card.color} progress-animate`}
                      style={{
                        animationDelay: `${
                          index * 200
                        }ms`,
                      }}
                    />

                  </div>
                </div>
              );
            }
          )}

        </section>

        {/* ==================================================
            DATA PREVIEWS
        ================================================== */}

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ==================================================
              GALLERY
          ================================================== */}

          <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">

            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Latest Gallery
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Showing latest 4 of{" "}
                  <span className="font-semibold text-slate-700">
                    {counts.gallery}
                  </span>{" "}
                  images
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ImageIcon size={19} />
              </div>

            </div>

            <div className="p-5 sm:p-6">

              {loading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <PreviewSkeleton
                        key={item}
                        image
                      />
                    )
                  )}
                </div>
              ) : latestGallery.length >
                0 ? (
                <div className="grid grid-cols-2 gap-4">

                  {latestGallery.map(
                    (item, index) => {
                      const image = resolveImage(
                        item?.image ||
                          item?.imageUrl ||
                          item?.url
                      );

                      return (
                        <div
                          key={getItemId(
                            item,
                            index
                          )}
                          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 aspect-[4/3]"
                        >

                          {image ? (
                            <img
                              src={image}
                              alt={getItemTitle(
                                item,
                                "Gallery image"
                              )}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon
                                size={32}
                              />
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">

                            <p className="text-white text-sm font-semibold truncate">
                              {getItemTitle(
                                item,
                                "Gallery"
                              )}
                            </p>

                            <p className="text-white/70 text-xs mt-0.5">
                              {formatDate(
                                getDateValue(
                                  item
                                )
                              )}
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <ImageIcon
                    size={35}
                    className="mx-auto mb-3"
                  />

                  <p className="text-sm">
                    No gallery images found.
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* ==================================================
              SERVICES
          ================================================== */}

          <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">

            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Latest Services
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Showing latest 4 of{" "}
                  <span className="font-semibold text-slate-700">
                    {counts.services}
                  </span>{" "}
                  services
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Zap size={19} />
              </div>

            </div>

            <div className="p-5 sm:p-6">

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <PreviewSkeleton
                        key={item}
                      />
                    )
                  )}
                </div>
              ) : latestServices.length >
                0 ? (
                <div className="space-y-3">

                  {latestServices.map(
                    (item, index) => (
                      <div
                        key={getItemId(
                          item,
                          index
                        )}
                        className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all"
                      >

                        <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Zap size={19} />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="font-semibold text-slate-800 truncate">
                            {getItemTitle(
                              item,
                              "Service"
                            )}
                          </p>

                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {item?.description ||
                              "Energy service"}
                          </p>

                        </div>

                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {formatDate(
                            getDateValue(
                              item
                            )
                          )}
                        </span>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <Zap
                    size={35}
                    className="mx-auto mb-3"
                  />

                  <p className="text-sm">
                    No services found.
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* ==================================================
              NEWS
          ================================================== */}

          <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">

            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Latest News
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Showing latest 4 of{" "}
                  <span className="font-semibold text-slate-700">
                    {counts.news}
                  </span>{" "}
                  news items
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Newspaper size={19} />
              </div>

            </div>

            <div className="p-5 sm:p-6">

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <PreviewSkeleton
                        key={item}
                      />
                    )
                  )}
                </div>
              ) : latestNews.length > 0 ? (
                <div className="space-y-3">

                  {latestNews.map(
                    (item, index) => (
                      <div
                        key={getItemId(
                          item,
                          index
                        )}
                        className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all"
                      >

                        <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Newspaper
                            size={19}
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="font-semibold text-slate-800 truncate">
                            {getItemTitle(
                              item,
                              "News"
                            )}
                          </p>

                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {item?.excerpt ||
                              item?.description ||
                              "Latest news"}
                          </p>

                        </div>

                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {formatDate(
                            getDateValue(
                              item
                            )
                          )}
                        </span>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <Newspaper
                    size={35}
                    className="mx-auto mb-3"
                  />

                  <p className="text-sm">
                    No news found.
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* ==================================================
              BLOGS
          ================================================== */}

          <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">

            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Latest Blogs
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Showing latest 4 of{" "}
                  <span className="font-semibold text-slate-700">
                    {counts.blogs}
                  </span>{" "}
                  blogs
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <PenTool size={19} />
              </div>

            </div>

            <div className="p-5 sm:p-6">

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <PreviewSkeleton
                        key={item}
                      />
                    )
                  )}
                </div>
              ) : latestBlogs.length > 0 ? (
                <div className="space-y-3">

                  {latestBlogs.map(
                    (item, index) => (
                      <div
                        key={getItemId(
                          item,
                          index
                        )}
                        className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all"
                      >

                        <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <PenTool
                            size={19}
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="font-semibold text-slate-800 truncate">
                            {getItemTitle(
                              item,
                              "Blog"
                            )}
                          </p>

                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {item?.excerpt ||
                              item?.description ||
                              "Latest blog"}
                          </p>

                        </div>

                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {formatDate(
                            getDateValue(
                              item
                            )
                          )}
                        </span>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <PenTool
                    size={35}
                    className="mx-auto mb-3"
                  />

                  <p className="text-sm">
                    No blogs found.
                  </p>
                </div>
              )}

            </div>
          </div>

        </section>

        {/* ==================================================
            RECENT UPDATES
        ================================================== */}

        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 sm:p-7 border-b border-slate-100">

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Recent Updates
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Latest activity across your
                admin portal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <div className="relative">

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search updates..."
                  className="w-full sm:w-64 pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                    />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </div>

              </div>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-3 py-2.5 flex items-center justify-center">
                {filteredUpdates.length} Activities
              </span>

            </div>

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

                {filteredUpdates.length >
                0 ? (
                  filteredUpdates.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-emerald-50/40 transition-colors"
                      >

                        <td className="px-5 sm:px-7 py-5 font-semibold text-slate-800">
                          {item.content}
                        </td>

                        <td className="px-5 sm:px-7 py-5">

                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              item.badge ||
                              "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {item.action}
                          </span>

                        </td>

                        <td className="px-5 sm:px-7 py-5 text-slate-500 whitespace-nowrap">
                          {formatDate(
                            item.date
                          )}
                        </td>

                      </tr>
                    )
                  )
                ) : (
                  <tr>

                    <td
                      colSpan="3"
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No recent updates
                      found.
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>
        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="flex flex-col sm:flex-row justify-between items-center gap-2 py-4 text-xs text-slate-400">

          <p>
            ©{" "}
            {new Date().getFullYear()}{" "}
            ALDC Energy. All rights
            reserved.
          </p>

          <p className="flex items-center gap-2">

            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />

            Admin Dashboard

          </p>

        </footer>

      </main>

      {/* ==================================================
          ANIMATIONS
      ================================================== */}

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