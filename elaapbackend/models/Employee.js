import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    department: {
      type: String,
      default: "General",
      trim: true,
      maxlength: 100,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

employeeSchema.index({ active: 1, name: 1 });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;