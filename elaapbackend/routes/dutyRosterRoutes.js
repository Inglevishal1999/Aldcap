import express from "express";

import {
  getDutyRoster,
  saveDutyRoster,
  addEmployee,
} from "../controllers/dutyRosterController.js";

const router = express.Router();

// GET roster grid for a week
// GET /api/duty-roster?weekStart=YYYY-MM-DD
router.get("/", getDutyRoster);

// SAVE roster for a week
// PUT /api/duty-roster
router.put("/", saveDutyRoster);

// ADD employee
// POST /api/duty-roster/employees
router.post("/employees", addEmployee);

export default router;