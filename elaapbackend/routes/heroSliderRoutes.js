import express from "express";
import HeroSlider from "../models/HeroSlider.js";

const router = express.Router();

// GET all sliders
router.get("/", async (req, res) => {
  try {
    const sliders = await HeroSlider.find().sort({ createdAt: -1 });
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sliders", error: error.message });
  }
});

// POST new slider
router.post("/", async (req, res) => {
  try {
    const { title, subtitle, imageUrl } = req.body;
    const newSlider = new HeroSlider({ title, subtitle, imageUrl });
    const savedSlider = await newSlider.save();
    res.status(201).json(savedSlider);
  } catch (error) {
    res.status(500).json({ message: "Error creating slider", error: error.message });
  }
});

// PUT update slider
router.put("/:id", async (req, res) => {
  try {
    const { title, subtitle, imageUrl } = req.body;
    const updatedSlider = await HeroSlider.findByIdAndUpdate(
      req.params.id,
      { title, subtitle, imageUrl },
      { new: true }
    );
    res.json(updatedSlider);
  } catch (error) {
    res.status(500).json({ message: "Error updating slider", error: error.message });
  }
});

// DELETE slider
router.delete("/:id", async (req, res) => {
  try {
    await HeroSlider.findByIdAndDelete(req.params.id);
    res.json({ message: "Slider deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting slider", error: error.message });
  }
});

export default router;