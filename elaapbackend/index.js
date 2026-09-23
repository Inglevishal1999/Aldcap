
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
import dutyRosterRoutes from "./routes/dutyRosterRoutes.js";

// ==========================================
// Environment Variables
// ==========================================
dotenv.config();

// ==========================================
// Express App
// ==========================================
const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// __dirname for ES Modules
// ==========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// CORS Configuration
// ==========================================
const allowedOrigins = [
  "http://localhost:5173",
  "https://aldcap.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// Body Parser Middleware
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Static Uploads Folder
// ==========================================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ==========================================
// API STATUS
// ==========================================
app.get("/api/status", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ELAP backend is running perfectly!",
  });
});

// ==========================================
// API ROUTES
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
// 404 API Handler
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
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ==========================================
// Connect MongoDB + Start Server
// ==========================================
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("======================================");
      console.log("ELAP BACKEND STARTED");
      console.log(`Server running on port: ${PORT}`);
      console.log(`Status: /api/status`);
      console.log(`Auth: /api/auth`);
      console.log(`Blogs: /api/blogs`);
      console.log(`Gallery: /api/gallery`);
      console.log(`Duty Roster: /api/duty-roster`);
      console.log("======================================");
    });
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
    process.exit(1);
  });
