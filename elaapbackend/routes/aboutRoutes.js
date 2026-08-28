import express from "express";
import { getAbout, updateAbout } from "../controllers/aboutController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAbout);
router.put("/", protect, adminOnly, updateAbout);

export default router;