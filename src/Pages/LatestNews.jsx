import {
  Megaphone,
  CalendarClock,
  ArrowRight,
} from "lucide-react";

import CardShell from "../data/CardShell";

function LatestNews() {
  const news = [
    {
      id: 1,
      title: "Scheduled Power Maintenance in Nagpur",
      date: "02 August 2026",
      description:
        "Power supply will remain interrupted from 10:00 AM to 2:00 PM in selected areas due to maintenance work.",
    },
    {
      id: 2,
      title: "New 132KV Substation Successfully Commissioned",
      date: "28 July 2026",
      description:
        "ALDC Electrical has inaugurated a new high-capacity substation to improve power reliability.",
    },
    {
      id: 3,
      title: "Consumer Awareness Program on Electrical Safety",
      date: "20 July 2026",
      description:
        "Join our free electrical safety awareness program to learn about safe electricity usage.",
    },
    {
      id: 4,
      title: "Recruitment Notification for Junior Engineer",
      date: "15 July 2026",
      description:
        "Applications are invited for the post of Junior Engineer.",
    },
    {
      id: 5,
      title: "Tender Notice for Electrical Equipment",
      date: "10 July 2026",
      description:
        "Tender invited for supply of electrical materials.",
    },
  ];

  return (
    <CardShell
      icon={<Megaphone className="w-5 h-5" />}
      title="LATEST NEWS"
    >
      <div className="h-[420px] sm:h-[450px] md:h-[500px] overflow-hidden">
        <marquee
          direction="up"
          scrollAmount="2"
          className="h-full"
          onMouseOver={(e) => e.target.stop()}
          onMouseOut={(e) => e.target.start()}
        >
          {news.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-200 p-4 sm:p-5 hover:bg-gray-50 transition-all duration-300"
            >
              {/* Date */}
              <div className="flex flex-wrap items-center gap-2 text-red-600 text-xs sm:text-sm font-semibold">
                <CalendarClock className="w-4 h-4 flex-shrink-0" />

                <span>{item.date}</span>

                <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap">
                  NEW
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-3 text-base sm:text-lg md:text-xl font-bold text-blue-900 leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm sm:text-[15px] text-gray-600 leading-6">
                {item.description}
              </p>

              {/* Read More */}
              <button className="mt-4 inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-700 hover:text-orange-500 transition-colors">
                Read More
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </marquee>
      </div>
    </CardShell>
  );
}

export default LatestNews;