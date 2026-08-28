import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const PAGE_SIZE = 9;

// No Vite proxy is configured in vite.config.js, so this MUST point directly
// at your Express server's full URL — check your backend's .env for PORT.
const API_ORIGIN = "http://localhost:5000";
const API_BASE = `${API_ORIGIN}/api/gallery`;

// Images come back from the API as relative paths like "/uploads/gallery/xyz.jpg".
// Prefix with API_ORIGIN so they resolve correctly if frontend/backend are on
// different ports.
function resolveImage(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
}

const STATS = [
  { label: "Active Projects", value: "42" },
  { label: "Grid Capacity", value: "1.2GW" },
  { label: "Years Powering Nagpur", value: "18" },
  { label: "Communities Served", value: "6" },
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error("Failed to load gallery");
        const json = await res.json();
        if (!cancelled) setItems(json.data ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchItems();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  const active = activeIndex !== null ? items[activeIndex] : null;

  function openAt(globalIndex) {
    setActiveIndex(globalIndex);
  }
  function close() {
    setActiveIndex(null);
  }
  function showPrev() {
    setActiveIndex((i) => (i - 1 + items.length) % items.length);
  }
  function showNext() {
    setActiveIndex((i) => (i + 1) % items.length);
  }

  return (
    <div className="bg-[#EEF1F6]">
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-[#0F2A52] px-6 pb-0 pt-24 text-white">
        {/* faint grid backdrop, echoes a transmission grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23F2A93B' stroke-width='1.5'%3E%3Cpath d='M0 20h30v20h20v40h30M60 0v40h60M0 80h50v40M90 40v80'/%3E%3C/g%3E%3Cg fill='%23F2A93B'%3E%3Ccircle cx='30' cy='40' r='2.5'/%3E%3Ccircle cx='50' cy='80' r='2.5'/%3E%3Ccircle cx='90' cy='40' r='2.5'/%3E%3Ccircle cx='60' cy='40' r='2.5'/%3E%3Ccircle cx='0' cy='80' r='2.5'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "120px 120px",
          }}
        />
        {/* warm glow, gold not teal, to stay on-brand with the amber underline used on the live nav tab */}
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #F2A93B 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-6xl">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#F2A93B]">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white/60">Gallery</span>
          </p>

          <h1 className="mt-5 flex items-start gap-2 text-[13vw] font-extrabold uppercase leading-[0.88] tracking-tight sm:text-6xl md:text-7xl">
            <BoltIcon className="mt-2 h-8 w-8 shrink-0 text-[#F2A93B] sm:h-12 sm:w-12" />
            <span>
              Powering the <span className="text-[#F2A93B]">Future</span>,<br className="hidden sm:block" /> in Pictures
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base text-white/65 md:text-lg">
            Substations at sunrise, crews on the line, and every milestone in
            between &mdash; a look at how ALDC Energy keeps Nagpur and the
            surrounding region charged and running.
          </p>
        </div>

        {/* live current line, signature element — power flowing through a transmission line */}
        <div className="relative mt-14 h-16 w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            className="h-full w-[200%] animate-[pulse-scroll_9s_linear_infinite]"
          >
            <polyline
              fill="none"
              stroke="#F2A93B"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              points="0,40 60,40 90,10 120,70 150,40 260,40 290,20 320,60 350,40 500,40 540,5 570,75 600,40 800,40 830,15 860,65 890,40 1050,40 1080,25 1110,55 1140,40 1200,40 1260,40 1290,10 1320,70 1350,40 1460,40 1490,20 1520,60 1550,40 1700,40 1740,5 1770,75 1800,40 2000,40 2030,15 2060,65 2090,40 2200,40"
              opacity="0.55"
            />
            {/* traveling current sparks */}
            <circle r="4" fill="#F2A93B">
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path="M0,40 60,40 90,10 120,70 150,40 260,40 290,20 320,60 350,40 500,40 540,5 570,75 600,40"
              />
            </circle>
            <circle r="4" fill="#F2A93B">
              <animateMotion
                dur="3s"
                begin="1.5s"
                repeatCount="indefinite"
                path="M600,40 800,40 830,15 860,65 890,40 1050,40 1080,25 1110,55 1140,40 1200,40"
              />
            </circle>
          </svg>
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        </div>

        {/* stat ticker strip */}
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#0F2A52] px-6 py-6">
              <p className="text-2xl font-bold text-white md:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- GRID ---------------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-[#0F2A52]">Recent Uploads</h2>
          <p className="text-sm text-[#0F2A52]/50">
            Page {page} of {totalPages}
          </p>
        </div>

        {loading && <p className="py-16 text-center text-[#0F2A52]/50">Loading gallery…</p>}
        {!loading && error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">{error}</p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="py-16 text-center text-[#0F2A52]/50">No photos yet — check back soon.</p>
        )}

        {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((item, i) => {
            const globalIndex = (page - 1) * PAGE_SIZE + i;
            return (
              <button
                key={item._id ?? item.id}
                type="button"
                onClick={() => openAt(globalIndex)}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-[#0F2A52] text-left shadow-md shadow-[#0F2A52]/10"
              >
                <img
                  src={resolveImage(item.image)}
                  alt={item.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* glass caption overlay */}
                <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="line-clamp-1 text-sm font-semibold text-white">{item.caption}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                    {new Date(item.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {/* corner tag, always visible */}
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-[#F2A93B] group-hover:text-[#0F2A52]">
                  <BoltIcon className="h-4 w-4" />
                </span>
              </button>
            );
          })}
        </div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-1.5">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#0F2A52] transition-colors hover:bg-[#0F2A52]/5 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  n === page ? "bg-[#F2A93B] text-[#0F2A52]" : "text-[#0F2A52] hover:bg-[#0F2A52]/5"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#0F2A52] transition-colors hover:bg-[#0F2A52]/5 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ›
            </button>
          </div>
        )}

        {/* closing CTA */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#0F2A52] p-8 text-white sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[#F2A93B]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
            </span>
            <div>
              <p className="text-lg font-semibold">Have an event or moment to share?</p>
              <p className="mt-0.5 text-sm text-white/60">Send it our way and be part of the ALDC story.</p>
            </div>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F2A93B] px-5 py-2.5 text-sm font-semibold text-[#0F2A52] transition-colors hover:brightness-95"
          >
            Submit your photos
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ---------------- LIGHTBOX ---------------- */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <button
            type="button"
            onClick={showPrev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-6"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-6"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <div className="flex max-h-full w-full max-w-3xl flex-col items-center">
            <p className="mb-3 self-end font-mono text-xs text-white/50">
              {activeIndex + 1} / {items.length}
            </p>
            <img src={resolveImage(active.image)} alt={active.caption} className="max-h-[65vh] w-auto rounded-sm object-contain" />
            <div className="mt-4 w-full">
              <p className="text-xs text-white/50">
                {new Date(active.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="mt-2 text-sm text-white/80">{active.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* pulse-line scroll keyframes */}
      <style>{`
        @keyframes pulse-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function BoltIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13 2 3 14h6l-1 8 11-14h-6l1-6Z" />
    </svg>
  );
}