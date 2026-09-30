import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Megaphone, Calendar, ArrowRight } from "lucide-react";
import axios from "axios";

const API_URL = `${
  import.meta.env.VITE_API_URL || "https://elaap-backend-live.onrender.com/api"
}/news/public`;

const defaultNews = [
  {
    _id: "1",
    title: "New 132KV Substation Successfully Commissioned",
    date: "2026-07-28",
    content:
      "ALDC Electrical has inaugurated a new high-capacity substation to improve power reliability.",
    isNew: true,
  },
  {
    _id: "2",
    title: "Consumer Awareness Program on Electrical Safety",
    date: "2026-07-20",
    content:
      "An awareness program was conducted to educate consumers about electrical safety and precautions.",
    isNew: true,
  },
  {
    _id: "3",
    title: "Scheduled Maintenance Work Completed",
    date: "2026-07-15",
    content:
      "Routine maintenance work across main power transformers was successfully completed ahead of schedule.",
    isNew: false,
  },
];

/* Formats "2026-09-29" or "28 July 2026" as "29 September 2026" */
const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* Cuts on a word boundary and removes scraped "Read more at:" leftovers */
const cleanSummary = (text = "", max = 160) => {
  const cleaned = text.replace(/\s*\.*\s*read more at:?.*$/i, "").trim();
  if (cleaned.length <= max) return cleaned;
  const cut = cleaned.lastIndexOf(" ", max);
  return `${cleaned.slice(0, cut > 0 ? cut : max).trimEnd()}…`;
};

export default function LatestNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    let active = true;

    const fetchNews = async () => {
      try {
        const res = await axios.get(API_URL);
        const list = res.data?.data;
        if (active) setNews(list && list.length > 0 ? list : defaultNews);
      } catch (err) {
        console.error("Error fetching news list:", err);
        if (active) setNews(defaultNews);
      }
    };

    fetchNews();
    return () => {
      active = false;
    };
  }, []);

  /* Duplicate the list so translateY(-50%) loops seamlessly */
  const source = news.length > 0 ? news : defaultNews;
  const displayList = [...source, ...source];

  return (
    <div className="flex h-150 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <style>{`
        @keyframes verticalMarquee {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }

        .marquee-track {
          display: flex;
          flex-direction: column;
          animation: verticalMarquee 10s linear infinite;
        }

        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }

        .marquee-container {
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent);
                  mask-image: linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
          .marquee-container { overflow-y: auto; }
        }
      `}</style>

      {/* Fixed header */}
      <div className="z-10 mb-4 flex shrink-0 items-center justify-between border-b border-slate-100 bg-white pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <Megaphone size={18} />
          </div>
          <h3 className="whitespace-nowrap text-sm font-bold uppercase tracking-wide text-slate-800">
            Latest News
          </h3>
        </div>
        <Link
          to="/news"
          className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800"
        >
          View All &gt;
        </Link>
      </div>

      {/* Infinite scroll wrapper */}
      <div className="marquee-container relative grow overflow-hidden">
        <div className="marquee-track">
          {displayList.map((item, index) => (
            <div
              key={`${item._id || item.title}-${index}`}
              className="shrink-0 border-b border-slate-100 py-4"
            >
              {/* Date & tag */}
              <div className="mb-2 flex items-center gap-2">
                <Calendar size={14} className="text-rose-500" />
                <span className="text-xs font-semibold text-rose-500">
                  {formatDate(item.date)}
                </span>
                {item.isNew !== false && (
                  <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    NEW
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 className="mb-2 text-base font-bold leading-snug text-slate-800 transition hover:text-blue-600">
                <Link to="/news">{item.title}</Link>
              </h4>

              {/* Summary */}
              <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                {cleanSummary(item.content)}
              </p>

              {/* Read more */}
              <Link
                to="/news"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 transition hover:text-blue-800"
              >
                Read More <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}