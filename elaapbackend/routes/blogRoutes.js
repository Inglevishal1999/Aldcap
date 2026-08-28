import express from "express";

import {
  getPublishedBlogs,
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

import blogUpload from "../middleware/blogUploadMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC / EMPLOYEE
// ==========================================

// Published blogs only
router.get("/", getPublishedBlogs);

// Single published blog
router.get("/:id", getBlogById);

// ==========================================
// ADMIN
// ==========================================

// All blogs including Draft
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllBlogs
);

// Create
router.post(
  "/",
  protect,
  adminOnly,
  blogUpload.single("image"),
  createBlog
);

// Update
router.put(
  "/:id",
  protect,
  adminOnly,
  blogUpload.single("image"),
  updateBlog
);

// Delete
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteBlog
);

export default router;