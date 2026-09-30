import { Link } from "react-router-dom";
import { CalendarClock, ChevronRight } from "lucide-react";

const rosterItems = [
  { time: "06:00 AM – 02:00 PM", shift: "Morning Shift", person: "Rahul Sharma", dept: "Operations" },
  { time: "02:00 PM – 10:00 PM", shift: "Evening Shift", person: "Amit Verma", dept: "Operations" },
  { time: "10:00 PM – 06:00 AM", shift: "Night Shift", person: "Vijay Singh", dept: "Operations" },
  { time: "06:00 AM – 06:00 PM", shift: "Maintenance", person: "Sunil Kumar", dept: "Maintenance" },
  { time: "06:00 AM – 06:00 PM", shift: "Control Room", person: "Priya Nair", dept: "Control Room" },
  { time: "09:00 AM – 05:00 PM", shift: "Admin Duty", person: "Neha Gupta", dept: "Administration" },
];

/*
  Responsive layout (matches the parent grid:
  1 column < lg, 3 columns in one row from lg):

  < 640px     1 column, narrow  -> stacked list
  640–1023px  1 column, wide    -> table
  1024–1279px 3 columns, narrow -> stacked list
  1280px+     3 columns, wider  -> table (time wraps to two lines)
*/
const TABLE_VISIBILITY = "hidden sm:flex lg:hidden xl:flex";
const LIST_VISIBILITY = "flex sm:hidden lg:flex xl:hidden";

const COLS = "grid grid-cols-[10rem_minmax(0,1fr)] xl:grid-cols-[7.5rem_minmax(0,1fr)]";

export default function DutyRoster() {
  return (
    <div className="flex h-auto min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:h-[600px]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600">
            <CalendarClock size={18} />
          </div>
          <h3 className="truncate text-sm font-bold uppercase tracking-wide text-slate-800">
            Duty Roster
          </h3>
        </div>
        <Link
          to="/roster"
          className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800"
        >
          View All <ChevronRight size={14} />
        </Link>
      </div>

      {/* Body: fills the remaining card height */}
      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
        {/* Table view */}
        <div
          role="table"
          aria-label="Employee duty roster"
          className={`${TABLE_VISIBILITY} min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-100`}
        >
          <div role="row" className={`${COLS} shrink-0 bg-blue-700 text-xs font-semibold uppercase tracking-wide text-white`}>
            <div role="columnheader" className="px-3 py-3">Time</div>
            <div role="columnheader" className="px-3 py-3">Shift / Employee</div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {rosterItems.map((row, idx) => (
              <div
                key={`${row.shift}-${idx}`}
                role="row"
                className={`${COLS} min-h-[3.5rem] flex-1 items-center ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                <div role="cell" className="whitespace-normal px-3 py-2 text-xs text-slate-600 sm:whitespace-nowrap xl:whitespace-normal">
                  {row.time}
                </div>
                <div role="cell" className="min-w-0 px-3 py-2">
                  <div className="truncate text-sm font-medium text-slate-800">{row.shift}</div>
                  <div className="truncate text-xs text-slate-500">
                    {row.person} · {row.dept}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked list view */}
        <ul className={`${LIST_VISIBILITY} min-h-0 flex-1 flex-col gap-2 overflow-y-auto`}>
          {rosterItems.map((row, idx) => (
            <li
              key={`${row.shift}-${idx}`}
              className="flex flex-1 flex-col justify-center rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <span className="text-sm font-semibold text-slate-800">{row.shift}</span>
                <span className="text-xs font-medium text-slate-500">{row.time}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs text-slate-600">
                <span>{row.person}</span>
                <span className="rounded bg-blue-100 px-1.5 py-0.5 font-medium text-blue-800">
                  {row.dept}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}