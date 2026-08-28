import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: [true, "Blog excerpt is required"],
      trim: true,
    },

    content: {
      type: String,
      required: [true, "Blog content is required"],
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      default: "Electrical Safety",
      trim: true,
    },

    author: {
      type: String,
      default: "ALDC Energy",
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;