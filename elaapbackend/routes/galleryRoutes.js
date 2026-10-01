
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
// GET /api/gallery
// PUBLIC
// =====================================================

router.get("/", getGalleryItems);

// =====================================================
// CREATE GALLERY ITEM
// POST /api/gallery
// ADMIN ONLY
// Content-Type: multipart/form-data
// Field name: image
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
// Content-Type: multipart/form-data
// Field name: image
//
// Supports:
// - Caption only
// - Caption + new image
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