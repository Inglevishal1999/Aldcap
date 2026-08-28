import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["Published", "Draft"], default: "Published" },
    isNewBadge: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

export default News;