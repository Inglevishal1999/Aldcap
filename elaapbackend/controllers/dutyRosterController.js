import DutyRoster from "../models/DutyRoster.js";
import Employee from "../models/Employee.js";

// GET roster grid for a given week
export const getDutyRoster = async (req, res) => {
  try {
    const { weekStart } = req.query;

    if (!weekStart) {
      return res.status(400).json({
        success: false,
        message: "weekStart is required",
      });
    }

    const employees = await Employee.find({ active: true }).sort({ name: 1 });
    const rosterDocs = await DutyRoster.find({ weekStart });

    const rosterMap = {};
    rosterDocs.forEach((doc) => {
      rosterMap[doc.employee.toString()] = doc;
    });

    const rows = employees.map((emp) => {
      const existing = rosterMap[emp._id.toString()];
      return {
        employee: {
          _id: emp._id,
          name: emp.name,
          employeeId: emp.employeeId,
        },
        mon: existing?.mon || "off",
        tue: existing?.tue || "off",
        wed: existing?.wed || "off",
        thu: existing?.thu || "off",
        fri: existing?.fri || "off",
        sat: existing?.sat || "off",
        sun: existing?.sun || "off",
      };
    });

    res.status(200).json({
      success: true,
      data: { rows },
    });
  } catch (error) {
    console.error("Get duty roster error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch duty roster",
      error: error.message,
    });
  }
};

// SAVE (bulk upsert) roster for a week
export const saveDutyRoster = async (req, res) => {
  try {
    const { weekStart, assignments } = req.body;

    if (!weekStart || !Array.isArray(assignments)) {
      return res.status(400).json({
        success: false,
        message: "weekStart and assignments are required",
      });
    }

    const operations = assignments.map((a) => ({
      updateOne: {
        filter: { employee: a.employee, weekStart },
        update: {
          $set: {
            mon: a.mon || "off",
            tue: a.tue || "off",
            wed: a.wed || "off",
            thu: a.thu || "off",
            fri: a.fri || "off",
            sat: a.sat || "off",
            sun: a.sun || "off",
          },
        },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await DutyRoster.bulkWrite(operations);
    }

    res.status(200).json({
      success: true,
      message: "Duty roster saved successfully",
    });
  } catch (error) {
    console.error("Save duty roster error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save duty roster",
      error: error.message,
    });
  }
};

// CREATE employee
export const addEmployee = async (req, res) => {
  try {
    const { name, employeeId, department } = req.body;

    if (!name || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "Name and employee ID are required",
      });
    }

    const existing = await Employee.findOne({ employeeId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    const employee = await Employee.create({ name, employeeId, department });

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Add employee error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add employee",
      error: error.message,
    });
  }
};