import mongoose from "mongoose";

const dutyRosterSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    weekStart: {
      type: String, // "YYYY-MM-DD" (Monday of that week)
      required: true,
    },
    mon: { type: String, default: "off" },
    tue: { type: String, default: "off" },
    wed: { type: String, default: "off" },
    thu: { type: String, default: "off" },
    fri: { type: String, default: "off" },
    sat: { type: String, default: "off" },
    sun: { type: String, default: "off" },
  },
  { timestamps: true }
);

dutyRosterSchema.index({ employee: 1, weekStart: 1 }, { unique: true });

const DutyRoster = mongoose.model("DutyRoster", dutyRosterSchema);

export default DutyRoster;