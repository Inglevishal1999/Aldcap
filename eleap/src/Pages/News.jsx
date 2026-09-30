import { useState, useEffect } from "react";
import { Megaphone, Calendar, ArrowRight, X, ExternalLink } from "lucide-react";
import axios from "axios";

const API_URL = `${
  import.meta.env.VITE_API_URL || "https://elaap-backend-live.onrender.com/api"
}/news/public`;

// Fallback data in case the database has no published items yet
const defaultNews = [
  {
    _id: "1",
    title: "New 132KV Substation Successfully Commissioned",
    date: "28 July 2026",
    content:
      "ALDC Electrical has inaugurated a new high-capacity substation to improve power reliability.",
    link: "",
    isNewBadge: true,
  },
  {
    _id: "2",
    title: "Consumer Awareness Program on Electrical Safety",
    date: "20 July 2026",
    content:
      "An awareness program was conducted to educate consumers about electrical safety and precautions.",
    link: "",
    isNewBadge: true,
  },
  {
    _id: "3",
    title: "Scheduled Maintenance Work Completed",
    date: "15 July 2026",
    content:
      "Routine maintenance work across main power transformers was successfully completed ahead of schedule.",
    link: "",
    isNewBadge: false,
  },
];

// Link attached by admin. Falls back to a URL inside the content
// (for old items that have "Read more at: https://...").
const getNewsLink = (item) => {
  if (item.link) return item.link;
  const match = item.content?.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : "";
};

// Remove the "Read more at: url" line so the raw URL is not displayed
const cleanContent = (text = "") =>
  text.replace(/Read more at:?\s*https?:\/\/[^\s]+/i, "").trim();

function NewBadge() {
  return (
    <span className="bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">
      NEW
    </span>
  );
}

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  // Close popup with ESC + lock background scroll while open
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const fetchNews = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data?.data && res.data.data.length > 0) {
        setNews(res.data.data);
      } else {
        setNews(defaultNews);
      }
    } catch (err) {
      console.error("Error fetching news page data:", err);
      setNews(defaultNews);
    } finally {
      setLoading(false);
    }
  };

  const selectedLink = selected ? getNewsLink(selected) : "";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Megaphone size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            LATEST NEWS
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <hr className="border-slate-100 mb-8" />

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-medium">
            Loading announcements...
          </div>
        ) : (
          <div className="space-y-10 pb-20">
            {news.map((item) => (
              <article
                key={item._id || item.title}
                className="border-b border-slate-100 pb-8 last:border-b-0"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={15} className="text-rose-500" />
                  <span className="text-sm font-semibold text-rose-500">
                    {item.date}
                  </span>
                  {item.isNewBadge !== false && <NewBadge />}
                </div>

                <h2
                  onClick={() => setSelected(item)}
                  className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 hover:text-blue-600 transition cursor-pointer"
                >
                  {item.title}
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-4xl mb-4 line-clamp-2">
                  {cleanContent(item.content)}
                </p>

                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition "
                  
                >
                  Read More <ArrowRight size={16} />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ===== POPUP ===== */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-3 pr-10">
              <Calendar size={15} className="text-rose-500" />
              <span className="text-sm font-semibold text-rose-500">
                {selected.date}
              </span>
              {selected.isNewBadge !== false && <NewBadge />}
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4 pr-6">
              {selected.title}
            </h3>

            <p className="text-slate-700 leading-relaxed mb-6 whitespace-pre-line">
              {cleanContent(selected.content)}
            </p>

            {selectedLink && (
              <a
                href={selectedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition"
              >
                View Full News <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}