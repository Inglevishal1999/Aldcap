import fs from "fs";
import path from "path";

import GalleryItem from "../models/GalleryItem.js";

// =====================================================
// GALLERY UPLOAD DIRECTORY
// =====================================================

const galleryUploadDir = path.join(
  process.cwd(),
  "uploads",
  "gallery"
);

// =====================================================
// BUILD IMAGE PATH
// =====================================================

const getImagePath = (filename) => {
  return `/uploads/gallery/${filename}`;
};

// =====================================================
// GET PHYSICAL IMAGE PATH
// =====================================================

const getPhysicalImagePath = (imagePath) => {
  if (!imagePath) {
    return null;
  }

  const fileName = path.basename(imagePath);

  return path.join(
    galleryUploadDir,
    fileName
  );
};

// =====================================================
// DELETE IMAGE FILE
// =====================================================

const deleteImageFile = (imagePath) => {
  if (!imagePath) {
    return;
  }

  const filePath =
    getPhysicalImagePath(imagePath);

  if (!filePath) {
    return;
  }

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      console.log(
        "Image deleted:",
        filePath
      );
    } else {
      console.log(
        "Image file not found:",
        filePath
      );
    }
  } catch (error) {
    console.error(
      "Error deleting image:",
      error.message
    );
  }
};

// =====================================================
// DELETE NEW UPLOADED FILE
// =====================================================

const deleteUploadedFile = (filename) => {
  if (!filename) {
    return;
  }

  const filePath = path.join(
    galleryUploadDir,
    filename
  );

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      console.log(
        "Uploaded file removed:",
        filePath
      );
    }
  } catch (error) {
    console.error(
      "Error removing uploaded file:",
      error.message
    );
  }
};

// =====================================================
// GET ALL GALLERY ITEMS
// GET /api/gallery
// =====================================================

export const getGalleryItems = async (
  req,
  res
) => {
  try {
    const items =
      await GalleryItem.find()
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
      message:
        "Error fetching gallery items",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE GALLERY ITEM
// GET /api/gallery/:id
// =====================================================

export const getGalleryItemById = async (
  req,
  res
) => {
  try {
    const item =
      await GalleryItem.findById(
        req.params.id
      ).lean();

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Gallery item not found",
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
      message:
        "Error fetching gallery item",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE GALLERY ITEM
// POST /api/gallery
// =====================================================

export const createGalleryItem = async (
  req,
  res
) => {
  try {
    const caption =
      typeof req.body.caption === "string"
        ? req.body.caption.trim()
        : "";

    console.log(
      "===================================="
    );

    console.log(
      "CREATE GALLERY"
    );

    console.log(
      "Caption:",
      caption
    );

    console.log(
      "File:",
      req.file
    );

    console.log(
      "===================================="
    );

    // =================================================
    // CAPTION VALIDATION
    // =================================================

    if (!caption) {
      if (req.file) {
        deleteUploadedFile(
          req.file.filename
        );
      }

      return res.status(400).json({
        success: false,
        message:
          "Caption is required",
      });
    }

    // =================================================
    // IMAGE VALIDATION
    // =================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Image file is required",
      });
    }

    // =================================================
    // PHYSICAL FILE CHECK
    // =================================================

    const physicalFilePath =
      path.join(
        galleryUploadDir,
        req.file.filename
      );

    console.log(
      "Physical image:",
      physicalFilePath
    );

    console.log(
      "Image exists:",
      fs.existsSync(
        physicalFilePath
      )
    );

    // =================================================
    // IMAGE URL
    // =================================================

    const image = getImagePath(
      req.file.filename
    );

    console.log(
      "MongoDB image path:",
      image
    );

    // =================================================
    // CREATE DATABASE RECORD
    // =================================================

    const item =
      await GalleryItem.create({
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
      message:
        "Gallery item created successfully",
      data: item,
    });
  } catch (error) {
    console.error(
      "Create gallery item error:",
      error
    );

    if (req.file) {
      deleteUploadedFile(
        req.file.filename
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "Error creating gallery item",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE GALLERY ITEM
// PUT /api/gallery/:id
// =====================================================

export const updateGalleryItem = async (
  req,
  res
) => {
  let newImageFilename = null;

  try {
    console.log(
      "===================================="
    );

    console.log(
      "UPDATE GALLERY"
    );

    console.log(
      "ID:",
      req.params.id
    );

    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "FILE:",
      req.file
    );

    console.log(
      "===================================="
    );

    // =================================================
    // FIND EXISTING ITEM
    // =================================================

    const existing =
      await GalleryItem.findById(
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
        message:
          "Gallery item not found",
      });
    }

    // =================================================
    // NEW IMAGE
    // =================================================

    if (req.file) {
      newImageFilename =
        req.file.filename;
    }

    // =================================================
    // CAPTION
    // =================================================

    const caption =
      req.body.caption !== undefined
        ? String(
            req.body.caption
          ).trim()
        : existing.caption;

    if (!caption) {
      if (newImageFilename) {
        deleteUploadedFile(
          newImageFilename
        );
      }

      return res.status(400).json({
        success: false,
        message:
          "Caption is required",
      });
    }

    // =================================================
    // UPDATE DATA
    // =================================================

    const updateData = {
      caption,
    };

    if (req.file) {
      updateData.image =
        getImagePath(
          req.file.filename
        );
    }

    // =================================================
    // UPDATE DATABASE
    // =================================================

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
        message:
          "Gallery item not found",
      });
    }

    // =================================================
    // DELETE OLD IMAGE
    // =================================================

    if (
      req.file &&
      existing.image &&
      existing.image !==
        updatedItem.image
    ) {
      deleteImageFile(
        existing.image
      );
    }

    console.log(
      "Gallery item updated:",
      updatedItem._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Gallery item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error(
      "Update gallery item error:",
      error
    );

    if (newImageFilename) {
      deleteUploadedFile(
        newImageFilename
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "Error updating gallery item",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE GALLERY ITEM
// DELETE /api/gallery/:id
// =====================================================

export const deleteGalleryItem = async (
  req,
  res
) => {
  try {
    console.log(
      "Deleting gallery item:",
      req.params.id
    );

    // =================================================
    // FIND ITEM
    // =================================================

    const item =
      await GalleryItem.findById(
        req.params.id
      );

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Gallery item not found",
      });
    }

    // =================================================
    // DELETE DATABASE RECORD
    // =================================================

    await GalleryItem.findByIdAndDelete(
      req.params.id
    );

    // =================================================
    // DELETE IMAGE
    // =================================================

    if (item.image) {
      deleteImageFile(
        item.image
      );
    }

    console.log(
      "Gallery item deleted:",
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete gallery item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error deleting gallery item",
      error: error.message,
    });
  }
};