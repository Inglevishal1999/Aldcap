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
// CORS
// ==========================================
// Define exactly which websites are allowed to talk to this backend
const allowedOrigins = [
  "http://localhost:5173",       // Your local React development server
  "https://vercel.app"    // Your live Vercel production website
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Crucial for parsing login sessions and cookies
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

// ==========================================
// DUTY ROSTER
// ==========================================
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

  const message =
    NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(err.status || 500).json({
    success: false,
    message,
  });
});

// ==========================================
// Start Server (with graceful shutdown)
// ==========================================
let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log("");
      console.log("======================================");
      console.log("       ELAP BACKEND STARTED");
      console.log("======================================");
      console.log(`Env        : ${NODE_ENV}`);
      console.log(`Server     : http://localhost:${PORT}`);
      console.log(`Status     : http://localhost:${PORT}/api/status`);
      console.log(`Gallery    : http://localhost:${PORT}/api/gallery`);
      console.log(`Blog       : http://localhost:${PORT}/api/blogs`);
      console.log(`Duty Roster: http://localhost:${PORT}/api/duty-roster`);
      console.log(`Uploads    : http://localhost:${PORT}/uploads`);
      console.log("======================================");
      console.log("");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

startServer();