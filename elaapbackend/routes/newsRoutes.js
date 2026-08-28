import express from "express";
import News from "../models/News.js";

const router = express.Router();

// GET /api/news/public - Fetch published news for frontend
router.get("/public", async (req, res) => {
  try {
    const newsList = await News.find({ status: "Published" }).sort({ createdAt: -1 });
    res.json({ success: true, data: newsList });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching published news" });
  }
});

// GET /api/news/admin - Fetch all news (published & drafts) for Admin panel
router.get("/admin", async (req, res) => {
  try {
    const newsList = await News.find().sort({ createdAt: -1 });
    res.json({ success: true, data: newsList });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching all news" });
  }
});

// POST /api/news - Create news article
router.post("/", async (req, res) => {
  try {
    const newArticle = new News(req.body);
    await newArticle.save();
    res.status(201).json({ success: true, message: "News created successfully", data: newArticle });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/news/:id - Update news article
router.put("/:id", async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: "News article not found" });
    }
    res.json({ success: true, message: "News updated successfully", data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/news/:id - Delete news article
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "News article not found" });
    }
    res.json({ success: true, message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete news article" });
  }
});

export default router;