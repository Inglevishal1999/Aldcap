import React from "react";
import { CalendarClock } from "lucide-react";
import CardShell from "../data/CardShell";

const rosterItems = [
  { time: "06:00 AM – 02:00 PM", shift: "Morning Shift", person: "Rahul Sharma", dept: "Operations" },
  { time: "02:00 PM – 10:00 PM", shift: "Evening Shift", person: "Amit Verma", dept: "Operations" },
  { time: "10:00 PM – 06:00 AM", shift: "Night Shift", person: "Vijay Singh", dept: "Operations" },
  { time: "06:00 AM – 06:00 PM", shift: "Maintenance", person: "Sunil Kumar", dept: "Maintenance" },
  { time: "06:00 AM – 06:00 PM", shift: "Control Room", person: "Priya Nair", dept: "Control Room" },
  { time: "09:00 AM – 05:00 PM", shift: "Admin Duty", person: "Neha Gupta", dept: "Administration" },
];

export default function RosterCard() {
  return (
    <CardShell
      icon={<CalendarClock className="h-4 w-4" />}
      title="EMPLOYEE DUTY ROSTER"
      viewAllLabel="VIEW FULL SCHEDULE"
    >
      {/* Table view — sm and up */}
      <div className="hidden overflow-hidden rounded-lg border border-slate-100 sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-blue-700 text-xs font-semibold uppercase tracking-wide text-white">
              <th className="px-3 py-2.5">Time</th>
              <th className="px-3 py-2.5">Shift</th>
              <th className="px-3 py-2.5">Employee / Team</th>
              <th className="px-3 py-2.5">Department</th>
            </tr>
          </thead>
          <tbody>
            {rosterItems.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">
                  {row.time}
                </td>
                <td className="px-3 py-2.5 font-medium text-slate-800">
                  {row.shift}
                </td>
                <td className="px-3 py-2.5 text-slate-700">{row.person}</td>
                <td className="px-3 py-2.5 text-slate-500">{row.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked card view — below sm */}
      <ul className="space-y-2 sm:hidden">
        {rosterItems.map((row, idx) => (
          <li
            key={idx}
            className="rounded-lg border border-slate-100 bg-slate-50 p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                {row.shift}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {row.time}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
              <span>{row.person}</span>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 font-medium text-blue-800">
                {row.dept}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}