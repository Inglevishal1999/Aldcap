import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

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
import dutyRosterRoutes from "./routes/dutyRosterRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ==========================================
// __dirname for ES Modules
// ==========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// Security / Performance middleware
// ==========================================
app.disable("x-powered-by");
app.use(helmet());
app.use(compression());

if (NODE_ENV !== "test") {
  app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
}

// ==========================================
// CORS (Updated to match your actual frontend website)
// ==========================================
const allowedOrigins = [
  "http://localhost:5173",       
  "https://aldcap.vercel.app" // Fixed your live Vercel URL here
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==========================================
// Body parsing
// ==========================================
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON in request body",
    });
  }
  next(err);
});

// ==========================================
// Static uploaded files
// ==========================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api/blogs", blogRoutes);
app.use("/api/duty-roster", dutyRosterRoutes);

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
// Central Error Handler
// ==========================================
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  const message = NODE_ENV === "production" ? "Internal server error" : err.message || "Internal server error";
  res.status(err.status || 500).json({ success: false, message });
});

// ==========================================
// Start Server
// ==========================================
let server;
const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
