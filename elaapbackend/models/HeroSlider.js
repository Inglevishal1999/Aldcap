import mongoose from "mongoose";

const heroSliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const HeroSlider = mongoose.models.HeroSlider || mongoose.model("HeroSlider", heroSliderSchema);

export default HeroSlider;