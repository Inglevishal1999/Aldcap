import express from "express";

import {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// GET all gallery items
// Public
router.get("/", getGalleryItems);

// CREATE gallery item
// Admin only
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createGalleryItem
);

// GET single gallery item
// Public
router.get("/:id", getGalleryItemById);

// UPDATE gallery item
// Admin only
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateGalleryItem
);

// DELETE gallery item
// Admin only
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteGalleryItem
);

export default router;