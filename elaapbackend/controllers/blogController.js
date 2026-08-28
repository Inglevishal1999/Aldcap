import Blog from "../models/Blog.js";
import fs from "fs";
import path from "path";

// ==========================================
// HELPERS
// ==========================================

// Turn a title into a URL-safe slug, and make it unique if it collides
const generateUniqueSlug = async (title, excludeId = null) => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = base;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await Blog.findOne(query);
    if (!existing) return slug;

    slug = `${base}-${counter}`;
    counter += 1;
  }
};

// Remove an uploaded image file from disk (used when replacing/deleting a blog)
const removeImageFile = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(process.cwd(), imagePath);
  fs.unlink(fullPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to delete blog image:", err.message);
    }
  });
};

// ==========================================
// GET PUBLISHED BLOGS (public)
// ==========================================
export const getPublishedBlogs = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { status: "Published" };

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (category && category !== "all") {
      filter.category = category;
    }

    const blogs = await Blog.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL BLOGS, including Draft (admin)
// ==========================================
export const getAllBlogs = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (category && category !== "all") {
      filter.category = category;
    }
    if (status && status !== "all") {
      filter.status = status;
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE BLOG BY ID
// ==========================================
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

// ==========================================
// CREATE BLOG
// ==========================================
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, status, author } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt and content are required",
      });
    }

    const slug = await generateUniqueSlug(title);

    const image = req.file ? `uploads/blog/${req.file.filename}` : "";

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      category,
      status: status || "Draft",
      author,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE BLOG
// ==========================================
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const { title, excerpt, content, category, status, author } = req.body;

    if (title !== undefined && title !== blog.title) {
      blog.title = title;
      blog.slug = await generateUniqueSlug(title, blog._id);
    }
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (content !== undefined) blog.content = content;
    if (category !== undefined) blog.category = category;
    if (status !== undefined) blog.status = status;
    if (author !== undefined) blog.author = author;

    // If a new image was uploaded, replace the old one
    if (req.file) {
      removeImageFile(blog.image);
      blog.image = `uploads/blog/${req.file.filename}`;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE BLOG
// ==========================================
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    removeImageFile(blog.image);
    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};