
import express from "express";

import {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/GalleryController.js";

import {
  protect,
  adminOnly,
  upload,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// GET ALL GALLERY ITEMS
// Public
// =====================================================
router.get("/", getGalleryItems);

// =====================================================
// CREATE GALLERY ITEM
// Admin only
// =====================================================
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createGalleryItem
);

// =====================================================
// GET SINGLE GALLERY ITEM
// Public
// =====================================================
router.get(
  "/:id",
  getGalleryItemById
);

// =====================================================
// UPDATE GALLERY ITEM
// Admin only
// =====================================================
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateGalleryItem
);

// =====================================================
// DELETE GALLERY ITEM
// Admin only
// =====================================================
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteGalleryItem
);

export default router;