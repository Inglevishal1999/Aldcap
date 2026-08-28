import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

// ==========================================
// Routes
// ==========================================

import authRoutes from "./routes/authRoutes.js";
import heroSliderRoutes from "./routes/heroSliderRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// __dirname for ES Modules
// ==========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// Middleware
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Static uploaded files
// ==========================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ==========================================
// Test Routes
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ELAP backend is running perfectly!",
  });
});

app.get("/api/status", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working!",
  });
});

// ==========================================
// API Routes
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/sliders", heroSliderRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/about", aboutRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/news", newsRoutes);

app.use("/api/gallery", galleryRoutes);

// BLOG
app.use("/api/blogs", blogRoutes);

// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ==========================================
// Start Server
// ==========================================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("");
      console.log("======================================");
      console.log("       ELAP BACKEND STARTED");
      console.log("======================================");
      console.log(`Server : http://localhost:${PORT}`);
      console.log(`Status : http://localhost:${PORT}/api/status`);
      console.log(`Gallery: http://localhost:${PORT}/api/gallery`);
      console.log(`Blog   : http://localhost:${PORT}/api/blogs`);
      console.log(`Uploads: http://localhost:${PORT}/uploads`);
      console.log("======================================");
      console.log("");
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();