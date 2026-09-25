import { useState, useEffect } from "react";
import { Megaphone, Calendar, ArrowRight } from "lucide-react";
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
    content: "ALDC Electrical has inaugurated a new high-capacity substation to improve power reliability.",
    isNew: true,
  },
  {
    _id: "2",
    title: "Consumer Awareness Program on Electrical Safety",
    date: "20 July 2026",
    content: "An awareness program was conducted to educate consumers about electrical safety and precautions.",
    isNew: true,
  },
  {
    _id: "3",
    title: "Scheduled Maintenance Work Completed",
    date: "15 July 2026",
    content: "Routine maintenance work across main power transformers was successfully completed ahead of schedule.",
    isNew: false,
  },
];

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error("Error fetching news page data:", err);
      setNews(defaultNews);
    } finally {
      setLoading(false);
    }
  };

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
                  {item.isNew !== false && (
                    <span className="bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                      NEW
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 hover:text-blue-600 transition">
                  {item.title}
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-4xl mb-4">
                  {item.content}
                </p>

                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  Read More <ArrowRight size={16} />
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}