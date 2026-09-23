import express from "express";
// Changed 'login' to 'loginUser' to match your controller name exactly
import { loginUser } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", loginUser);

export default router;
