
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

// =====================================================
// PUBLIC
// =====================================================

// GET /api/blogs
router.get("/", getPublishedBlogs);

// =====================================================
// ADMIN
// =====================================================

// GET /api/blogs/admin/all
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllBlogs
);

// POST /api/blogs
router.post(
  "/",
  protect,
  adminOnly,
  blogUpload.single("image"),
  createBlog
);

// PUT /api/blogs/:id
router.put(
  "/:id",
  protect,
  adminOnly,
  blogUpload.single("image"),
  updateBlog
);

// DELETE /api/blogs/:id
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteBlog
);

// =====================================================
// PUBLIC SINGLE BLOG
// =====================================================

// GET /api/blogs/:id
router.get("/:id", getBlogById);

export default router;

