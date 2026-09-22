import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Save,
  Loader2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

const SHIFTS = [
  { key: "off", label: "Off", className: "bg-slate-100 text-gray-400" },
  { key: "morning", label: "Morning", className: "bg-yellow-100 text-yellow-800" },
  { key: "evening", label: "Evening", className: "bg-blue-100 text-blue-800" },
  { key: "night", label: "Night", className: "bg-indigo-100 text-indigo-800" },
];

function getMonday(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const difference = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + difference);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateForAPI(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekDates(weekStart) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
}

function formatWeekLabel(weekStart) {
  const dates = getWeekDates(weekStart);
  const start = dates[0];
  const end = dates[6];

  const startText = start.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
  const endText = end.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${startText} - ${endText}`;
}

function ShiftCell({ value, onChange }) {
  const shift = SHIFTS.find((s) => s.key === value) || SHIFTS[0];

  return (
    <select
      value={value || "off"}
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

export default function DutyRosterAdmin() {
  const [roster, setRoster] = useState([]);
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    employeeId: "",
    department: "",
  });
  const [addingEmployee, setAddingEmployee] = useState(false);

  const abortControllerRef = useRef(null);

  const getHeaders = useCallback(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("adminToken");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const fetchRoster = useCallback(
    async (targetWeekStart, signal) => {
      try {
        setLoading(true);

        const week = formatDateForAPI(targetWeekStart);

        const response = await fetch(
          `${API_URL}/duty-roster?weekStart=${week}`,
          { headers: getHeaders(), signal }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load roster");
        }

        setRoster(result.data?.rows || []);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Roster error:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    },
    [getHeaders]
  );

  useEffect(() => {
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetchRoster(weekStart, controller.signal);

    return () => controller.abort();
  }, [weekStart, fetchRoster]);

  const handleShiftChange = useCallback((employeeId, day, value) => {
    setRoster((previous) =>
      previous.map((item) =>
        item.employee?._id === employeeId
          ? { ...item, [day]: value }
          : item
      )
    );
  }, []);

  const handlePreviousWeek = useCallback(() => {
    setWeekStart((previous) => {
      const date = new Date(previous);
      date.setDate(date.getDate() - 7);
      return date;
    });
  }, []);

  const handleNextWeek = useCallback(() => {
    setWeekStart((previous) => {
      const date = new Date(previous);
      date.setDate(date.getDate() + 7);
      return date;
    });
  }, []);

  const handleSaveRoster = useCallback(async () => {
    try {
      setSaving(true);

      const payload = {
        weekStart: formatDateForAPI(weekStart),
        assignments: roster.map((item) => ({
          employee: item.employee._id,
          mon: item.mon || "off",
          tue: item.tue || "off",
          wed: item.wed || "off",
          thu: item.thu || "off",
          fri: item.fri || "off",
          sat: item.sat || "off",
          sun: item.sun || "off",
        })),
      };

      const response = await fetch(`${API_URL}/duty-roster`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save roster");
      }

      alert("Roster saved successfully!");
    } catch (error) {
      console.error("Save roster error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }, [roster, weekStart, getHeaders]);

  const handleAddEmployee = useCallback(
    async (e) => {
      e.preventDefault();

      const name = employeeForm.name.trim();
      const employeeId = employeeForm.employeeId.trim();

      if (!name) {
        alert("Please enter employee name");
        return;
      }
      if (!employeeId) {
        alert("Please enter employee ID");
        return;
      }

      try {
        setAddingEmployee(true);

        const response = await fetch(`${API_URL}/duty-roster/employees`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ ...employeeForm, name, employeeId }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to add employee");
        }

        setEmployeeForm({ name: "", employeeId: "", department: "" });
        setShowAddEmployee(false);

        await fetchRoster(weekStart);

        alert("Employee added successfully!");
      } catch (error) {
        console.error("Add employee error:", error);
        alert(error.message);
      } finally {
        setAddingEmployee(false);
      }
    },
    [employeeForm, getHeaders, fetchRoster, weekStart]
  );

  const weekLabel = useMemo(() => formatWeekLabel(weekStart), [weekStart]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-blue-950">Duty Roster</h2>
          <p className="mt-1 text-sm text-gray-500">
            Assign shifts for each employee across the week.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousWeek}
            className="rounded-lg border border-slate-200 bg-white p-2 text-gray-500 transition hover:bg-slate-50"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="min-w-40 text-center">
            <p className="text-sm font-semibold text-blue-950">{weekLabel}</p>
            <p className="text-xs text-gray-400">This Week</p>
          </div>

          <button
            onClick={handleNextWeek}
            className="rounded-lg border border-slate-200 bg-white p-2 text-gray-500 transition hover:bg-slate-50"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowAddEmployee(true)}
            className="ml-2 flex items-center gap-1.5 rounded-lg bg-blue-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {SHIFTS.map((shift) => (
          <span
            key={shift.key}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${shift.className}`}
          >
            {shift.label}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-950" />
            <span className="text-sm text-gray-500">Loading roster...</span>
          </div>
        ) : (
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Employee
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day.key}
                    className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500"
                  >
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {roster.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No employees found.
                    <br />
                    <button
                      onClick={() => setShowAddEmployee(true)}
                      className="mt-3 font-semibold text-blue-950 underline"
                    >
                      Add your first employee
                    </button>
                  </td>
                </tr>
              ) : (
                roster.map((item) => (
                  <tr
                    key={item.employee?._id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="text-sm font-semibold text-blue-950">
                        {item.employee?.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.employee?.employeeId}
                      </div>
                    </td>

                    {DAYS.map((day) => (
                      <td key={day.key} className="px-2 py-2">
                        <ShiftCell
                          value={item[day.key]}
                          onChange={(value) =>
                            handleShiftChange(item.employee._id, day.key, value)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveRoster}
          disabled={saving || loading}
          className="flex items-center gap-2 rounded-lg bg-yellow-400 px-6 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Roster
            </>
          )}
        </button>
      </div>

      {showAddEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-blue-950">Add Employee</h3>
                <p className="text-xs text-gray-500">
                  Add a new employee to the duty roster.
                </p>
              </div>
              <button
                onClick={() => setShowAddEmployee(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-950">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={employeeForm.name}
                  onChange={(e) =>
                    setEmployeeForm({ ...employeeForm, name: e.target.value })
                  }
                  placeholder="Rahul Sharma"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-950">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={employeeForm.employeeId}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      employeeId: e.target.value,
                    })
                  }
                  placeholder="EMP001"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-950">
                  Department
                </label>
                <input
                  type="text"
                  value={employeeForm.department}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      department: e.target.value,
                    })
                  }
                  placeholder="Power Distribution"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmployee(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingEmployee}
                  className="flex items-center gap-2 rounded-lg bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
                >
                  {addingEmployee ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Employee
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}