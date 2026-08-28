import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

// =====================================================
// CONFIG
// Replace SEED_EMPLOYEES with employees fetched from your
// /api/users (or similar) endpoint once that exists.
// =====================================================

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SHIFTS = [
  { key: "off", label: "Off", className: "bg-slate-100 text-gray-400" },
  { key: "morning", label: "Morning", className: "bg-yellow-100 text-yellow-800" },
  { key: "evening", label: "Evening", className: "bg-blue-100 text-blue-800" },
  { key: "night", label: "Night", className: "bg-indigo-100 text-indigo-800" },
];

const SEED_EMPLOYEES = [
  { id: "e1", name: "Rahul Sharma" },
  { id: "e2", name: "Priya Nair" },
  { id: "e3", name: "Arjun Mehta" },
];

function buildInitialRoster(employees) {
  const roster = {};
  employees.forEach((emp) => {
    roster[emp.id] = {};
    DAYS.forEach((day) => {
      roster[emp.id][day] = "off";
    });
  });
  return roster;
}

// =====================================================
// SHIFT CELL
// =====================================================

function ShiftCell({ value, onChange }) {
  const shift = SHIFTS.find((s) => s.key === value) || SHIFTS[0];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full cursor-pointer rounded-lg border-0
        px-2 py-2 text-center text-xs font-semibold
        outline-none ring-1 ring-inset ring-slate-200
        focus:ring-2 focus:ring-blue-400
        ${shift.className}
      `}
    >
      {SHIFTS.map((s) => (
        <option key={s.key} value={s.key}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

// =====================================================
// DUTY ROSTER ADMIN
// =====================================================

export default function DutyRosterAdmin() {
  const [employees] = useState(SEED_EMPLOYEES);
  const [roster, setRoster] = useState(() => buildInitialRoster(SEED_EMPLOYEES));
  const [weekLabel, setWeekLabel] = useState("This Week");

  const handleShiftChange = (employeeId, day, value) => {
    setRoster((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [day]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-blue-950">Duty Roster</h2>
          <p className="mt-1 text-sm text-gray-500">
            Assign shifts for each employee across the week.
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
            {weekLabel}
          </span>

          <button
            className="rounded-lg border border-slate-200 bg-white p-2 text-gray-500 hover:bg-slate-50"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            className="
              ml-2 flex items-center gap-1.5 rounded-lg
              bg-blue-950 px-4 py-2 text-sm font-semibold text-white
              transition hover:bg-blue-900
            "
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {SHIFTS.map((s) => (
          <span
            key={s.key}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${s.className}`}
          >
            {s.label}
          </span>
        ))}
      </div>

      {/* Roster table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="w-full min-w-180 border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Employee
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-slate-100 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-blue-950">
                  {emp.name}
                </td>

                {DAYS.map((day) => (
                  <td key={day} className="px-2 py-2">
                    <ShiftCell
                      value={roster[emp.id]?.[day] ?? "off"}
                      onChange={(value) =>
                        handleShiftChange(emp.id, day, value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          className="
            rounded-lg bg-yellow-400 px-6 py-3
            text-sm font-bold text-blue-950
            transition hover:bg-yellow-300
          "
        >
          Save Roster
        </button>
      </div>
    </div>
  );
}