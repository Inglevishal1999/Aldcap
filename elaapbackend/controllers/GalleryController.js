import fs from "fs";
import path from "path";
import GalleryItem from "../models/GalleryItem.js";

// ------------------------------------
// GET /api/gallery
// ------------------------------------

export const getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({
      date: -1,
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Get gallery items error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching gallery items",
      error: error.message,
    });
  }
};

// ------------------------------------
// GET /api/gallery/:id
// ------------------------------------

export const getGalleryItemById = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get gallery item error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching gallery item",
      error: error.message,
    });
  }
};

// ------------------------------------
// POST /api/gallery
// ------------------------------------

export const createGalleryItem = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!caption || !caption.trim()) {
      return res.status(400).json({
        success: false,
        message: "Caption is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const image = `/uploads/gallery/${req.file.filename}`;

    const item = await GalleryItem.create({
      caption: caption.trim(),
      image,
      date: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: item,
    });
  } catch (error) {
    console.error("Create gallery item error:", error);

    // Remove uploaded image if database save fails
    if (req.file) {
      const filePath = path.join(
        process.cwd(),
        "uploads",
        "gallery",
        req.file.filename
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error creating gallery item",
      error: error.message,
    });
  }
};

// ------------------------------------
// PUT /api/gallery/:id
// ------------------------------------

export const updateGalleryItem = async (req, res) => {
  try {
    const existing = await GalleryItem.findById(
      req.params.id
    );

    if (!existing) {
      // Remove newly uploaded file if item doesn't exist
      if (req.file) {
        const newFilePath = path.join(
          process.cwd(),
          "uploads",
          "gallery",
          req.file.filename
        );

        if (fs.existsSync(newFilePath)) {
          fs.unlinkSync(newFilePath);
        }
      }

      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    const caption =
      req.body.caption !== undefined
        ? req.body.caption.trim()
        : existing.caption;

    if (!caption) {
      return res.status(400).json({
        success: false,
        message: "Caption is required",
      });
    }

    const update = {
      caption,
    };

    // New image uploaded
    if (req.file) {
      update.image = `/uploads/gallery/${req.file.filename}`;
    }

    const updatedItem =
      await GalleryItem.findByIdAndUpdate(
        req.params.id,
        update,
        {
          new: true,
          runValidators: true,
        }
      );

    // Delete old image after successful DB update
    if (req.file && existing.image) {
      const oldFileName = path.basename(
        existing.image
      );

      const oldFilePath = path.join(
        process.cwd(),
        "uploads",
        "gallery",
        oldFileName
      );

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Update gallery item error:", error);

    // Remove newly uploaded file if update failed
    if (req.file) {
      const newFilePath = path.join(
        process.cwd(),
        "uploads",
        "gallery",
        req.file.filename
      );

      if (fs.existsSync(newFilePath)) {
        fs.unlinkSync(newFilePath);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error updating gallery item",
      error: error.message,
    });
  }
};

// ------------------------------------
// DELETE /api/gallery/:id
// ------------------------------------

export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findById(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // Delete database record
    await GalleryItem.findByIdAndDelete(req.params.id);

    // Delete image from disk
    if (item.image) {
      const fileName = path.basename(item.image);

      const filePath = path.join(
        process.cwd(),
        "uploads",
        "gallery",
        fileName
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery item error:", error);

    res.status(500).json({
      success: false,
      message: "Error deleting gallery item",
      error: error.message,
    });
  }
};