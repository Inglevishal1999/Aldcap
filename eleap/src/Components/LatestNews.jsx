import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Megaphone, Calendar, ArrowRight } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/news/public";

const defaultNews = [
  {
    _id: "1",
    title: "New 132KV Substation Successfully Commissioned",
    date: "28 July 2026",
    content:
      "ALDC Electrical has inaugurated a new high-capacity substation to improve power reliability.",
    isNew: true,
  },
  {
    _id: "2",
    title: "Consumer Awareness Program on Electrical Safety",
    date: "20 July 2026",
    content:
      "An awareness program was conducted to educate consumers about electrical safety and precautions.",
    isNew: true,
  },
  {
    _id: "3",
    title: "Scheduled Maintenance Work Completed",
    date: "15 July 2026",
    content:
      "Routine maintenance work across main power transformers was successfully completed ahead of schedule.",
    isNew: false,
  },
];

export default function LatestNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data?.data && res.data.data.length > 0) {
        setNews(res.data.data);
      } else {
        setNews(defaultNews);
      }
    } catch (err) {
      console.error("Error fetching news list:", err);
      setNews(defaultNews);
    }
  };

  // We duplicate the list so when 50% translates, it perfectly overlays the second half seamlessly
  const displayList =
    news.length > 0 ? [...news, ...news] : [...defaultNews, ...defaultNews];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-[550px] overflow-hidden">
      {/* Dynamic CSS Keyframes for Infinite Smooth Marquee */}
      <style>{`
        @keyframes verticalMarquee {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        
        .marquee-track {
          display: flex;
          flex-direction: column;
          animation: verticalMarquee 18s linear infinite;
        }

        /* Stops scrolling instantly when user hovers to read or click */
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* Fixed Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 bg-white z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Megaphone size={18} />
          </div>
          <h3 className="font-bold text-slate-800 tracking-wide text-sm uppercase">
            Latest News
          </h3>
        </div>
        <Link
          to="/news"
          className="text-xs font-bold text-blue-600 hover:text-blue-800 tracking-wider uppercase flex items-center gap-1"
        >
          View All &gt;
        </Link>
      </div>

      {/* Infinite Scroll Wrapper */}
      <div className="marquee-container flex-grow overflow-hidden relative">
        <div className="marquee-track space-y-6">
          {displayList.map((item, index) => (
            <div
              key={`${item._id || item.title}-${index}`}
              className="border-b border-slate-100 pb-5 last:border-b-0 shrink-0"
            >
              {/* Date & Tag */}
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} className="text-rose-500" />
                <span className="text-xs font-semibold text-rose-500">
                  {item.date}
                </span>
                {item.isNew !== false && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 className="font-bold text-slate-800 text-base leading-snug mb-2 hover:text-blue-600 transition cursor-pointer">
                {item.title}
              </h4>

              {/* Content */}
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">
                {item.content}
              </p>

              {/* Read More */}
              <Link
                to="/news"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
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
