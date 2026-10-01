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
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// =====================================================
// GET ALL GALLERY ITEMS
// GET /api/gallery
// PUBLIC
// =====================================================

router.get(
  "/",
  getGalleryItems
);

// =====================================================
// CREATE GALLERY ITEM
// POST /api/gallery
// ADMIN ONLY
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
// GET /api/gallery/:id
// PUBLIC
// =====================================================

router.get(
  "/:id",
  getGalleryItemById
);

// =====================================================
// UPDATE GALLERY ITEM
// PUT /api/gallery/:id
// ADMIN ONLY
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
// DELETE /api/gallery/:id
// ADMIN ONLY
// =====================================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteGalleryItem
);

export default router;