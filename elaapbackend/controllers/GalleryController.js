
import fs from "fs";
import path from "path";
import GalleryItem from "../models/GalleryItem.js";

// =====================================================
// HELPER: Build MongoDB image path
// =====================================================

const getImagePath = (filename) => {
  return `/uploads/${filename}`;
};

// =====================================================
// HELPER: Delete physical image
// =====================================================

const deleteImageFile = (imagePath) => {
  if (!imagePath) return;

  const fileName = path.basename(imagePath);

  const filePath = path.join(
    process.cwd(),
    "uploads",
    fileName
  );

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Image deleted:", filePath);
    }
  } catch (error) {
    console.error("Error deleting image:", error.message);
  }
};

// =====================================================
// HELPER: Delete newly uploaded file
// =====================================================

const deleteUploadedFile = (filename) => {
  if (!filename) return;

  const filePath = path.join(
    process.cwd(),
    "uploads",
    filename
  );

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Uploaded file removed:", filePath);
    }
  } catch (error) {
    console.error(
      "Error removing uploaded file:",
      error.message
    );
  }
};

// =====================================================
// GET /api/gallery
// PUBLIC
// =====================================================

export const getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find()
      .sort({ date: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error(
      "Get gallery items error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error fetching gallery items",
      error: error.message,
    });
  }
};

// =====================================================
// GET /api/gallery/:id
// PUBLIC
// =====================================================

export const getGalleryItemById = async (req, res) => {
  try {
    const item = await GalleryItem.findById(
      req.params.id
    ).lean();

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error(
      "Get gallery item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error fetching gallery item",
      error: error.message,
    });
  }
};

// =====================================================
// POST /api/gallery
// ADMIN ONLY
// multipart/form-data
// =====================================================

export const createGalleryItem = async (req, res) => {
  try {
    const caption =
      typeof req.body.caption === "string"
        ? req.body.caption.trim()
        : "";

    console.log("====================================");
    console.log("CREATE GALLERY");
    console.log("Caption:", caption);
    console.log("File:", req.file);
    console.log("====================================");

    // ---------------------------------------------
    // Validate caption
    // ---------------------------------------------

    if (!caption) {
      if (req.file) {
        deleteUploadedFile(req.file.filename);
      }

      return res.status(400).json({
        success: false,
        message: "Caption is required",
      });
    }

    // ---------------------------------------------
    // Validate image
    // ---------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    // ---------------------------------------------
    // Store only image path in MongoDB
    // ---------------------------------------------

    const image = getImagePath(
      req.file.filename
    );

    // ---------------------------------------------
    // Create MongoDB record
    // ---------------------------------------------

    const item = await GalleryItem.create({
      caption,
      image,
      date: new Date(),
    });

    console.log(
      "Gallery item created:",
      item._id
    );

    return res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: item,
    });
  } catch (error) {
    console.error(
      "Create gallery item error:",
      error
    );

    // Remove image if database creation fails
    if (req.file) {
      deleteUploadedFile(
        req.file.filename
      );
    }

    return res.status(500).json({
      success: false,
      message: "Error creating gallery item",
      error: error.message,
    });
  }
};

// =====================================================
// PUT /api/gallery/:id
// ADMIN ONLY
// multipart/form-data
//
// Supports:
// 1. Caption only
// 2. Caption + new image
// =====================================================

export const updateGalleryItem = async (req, res) => {
  let newImageFilename = null;

  try {
    console.log("====================================");
    console.log("UPDATE GALLERY");
    console.log("ID:", req.params.id);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("====================================");

    // ---------------------------------------------
    // Find existing gallery item
    // ---------------------------------------------

    const existing = await GalleryItem.findById(
      req.params.id
    );

    if (!existing) {
      if (req.file) {
        deleteUploadedFile(
          req.file.filename
        );
      }

      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // ---------------------------------------------
    // Store newly uploaded filename
    // ---------------------------------------------

    if (req.file) {
      newImageFilename = req.file.filename;
    }

    // ---------------------------------------------
    // Caption
    // ---------------------------------------------

    const caption =
      req.body.caption !== undefined
        ? String(req.body.caption).trim()
        : existing.caption;

    if (!caption) {
      if (newImageFilename) {
        deleteUploadedFile(
          newImageFilename
        );
      }

      return res.status(400).json({
        success: false,
        message: "Caption is required",
      });
    }

    // ---------------------------------------------
    // Build update
    // ---------------------------------------------

    const updateData = {
      caption,
    };

    // ---------------------------------------------
    // If new image exists
    // ---------------------------------------------

    if (req.file) {
      updateData.image = getImagePath(
        req.file.filename
      );
    }

    // ---------------------------------------------
    // Update MongoDB
    // ---------------------------------------------

    const updatedItem =
      await GalleryItem.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedItem) {
      if (newImageFilename) {
        deleteUploadedFile(
          newImageFilename
        );
      }

      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // ---------------------------------------------
    // Delete old image ONLY after successful DB update
    // ---------------------------------------------

    if (
      req.file &&
      existing.image &&
      existing.image !== updatedItem.image
    ) {
      deleteImageFile(existing.image);
    }

    console.log(
      "Gallery item updated:",
      updatedItem._id
    );

    return res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error(
      "Update gallery item error:",
      error
    );

    // ---------------------------------------------
    // If update failed, remove newly uploaded image
    // ---------------------------------------------

    if (newImageFilename) {
      deleteUploadedFile(
        newImageFilename
      );
    }

    return res.status(500).json({
      success: false,
      message: "Error updating gallery item",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE /api/gallery/:id
// ADMIN ONLY
// =====================================================

export const deleteGalleryItem = async (req, res) => {
  try {
    console.log(
      "Deleting gallery item:",
      req.params.id
    );

    // ---------------------------------------------
    // Find item
    // ---------------------------------------------

    const item = await GalleryItem.findById(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // ---------------------------------------------
    // Delete MongoDB record
    // ---------------------------------------------

    await GalleryItem.findByIdAndDelete(
      req.params.id
    );

    // ---------------------------------------------
    // Delete physical image
    // ---------------------------------------------

    if (item.image) {
      deleteImageFile(item.image);
    }

    console.log(
      "Gallery item deleted:",
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete gallery item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error deleting gallery item",
      error: error.message,
    });
  }
};

