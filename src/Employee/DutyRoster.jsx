import { ChevronLeft, ChevronRight } from "lucide-react";

// =====================================================
// CONFIG
// Replace SEED_MY_ROSTER with data fetched for the logged-in
// employee from your backend once the endpoint exists
// (e.g. GET /api/roster/me).
// =====================================================

const SEED_MY_ROSTER = [
  { day: "Monday", date: "Aug 17", shift: "Morning", time: "6:00 AM – 2:00 PM" },
  { day: "Tuesday", date: "Aug 18", shift: "Morning", time: "6:00 AM – 2:00 PM" },
  { day: "Wednesday", date: "Aug 19", shift: "Off", time: "—" },
  { day: "Thursday", date: "Aug 20", shift: "Evening", time: "2:00 PM – 10:00 PM" },
  { day: "Friday", date: "Aug 21", shift: "Evening", time: "2:00 PM – 10:00 PM" },
  { day: "Saturday", date: "Aug 22", shift: "Night", time: "10:00 PM – 6:00 AM" },
  { day: "Sunday", date: "Aug 23", shift: "Off", time: "—" },
];

const SHIFT_STYLES = {
  Off: "bg-slate-100 text-gray-400",
  Morning: "bg-yellow-100 text-yellow-800",
  Evening: "bg-blue-100 text-blue-800",
  Night: "bg-indigo-100 text-indigo-800",
};

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

// =====================================================
// DUTY ROSTER (EMPLOYEE VIEW)
// =====================================================

export default function DutyRoster() {
  const today = todayLabel();

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-blue-950">My Duty Roster</h2>
          <p className="mt-1 text-sm text-gray-500">
            Your assigned shifts for the week.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-200 bg-white p-2 text-gray-500 hover:bg-slate-50"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="min-w-30 text-center text-sm font-semibold text-blue-950">
            This Week
          </span>

          <button
            className="rounded-lg border border-slate-200 bg-white p-2 text-gray-500 hover:bg-slate-50"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Roster list */}
      <div className="overflow-hidden rounded-2xl bg-white shadow">
        {SEED_MY_ROSTER.map((entry, i) => (
          <div
            key={entry.day}
            className={`
              flex items-center justify-between px-5 py-4
              ${i !== SEED_MY_ROSTER.length - 1 ? "border-b border-slate-100" : ""}
              ${entry.day === today ? "bg-blue-50/60" : ""}
            `}
          >
            <div className="flex items-center gap-4">
              <div className="w-24">
                <p className="text-sm font-bold text-blue-950">
                  {entry.day}
                  {entry.day === today && (
                    <span className="ml-2 rounded-full bg-blue-950 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Today
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400">{entry.date}</p>
              </div>

              <p className="text-sm text-gray-500">{entry.time}</p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                SHIFT_STYLES[entry.shift] || SHIFT_STYLES.Off
              }`}
            >
              {entry.shift}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}