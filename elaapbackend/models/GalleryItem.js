import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const GalleryItem = mongoose.model(
  "GalleryItem",
  galleryItemSchema
);

export default GalleryItem;