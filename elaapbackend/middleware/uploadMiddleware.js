import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// =====================================================
// ES MODULE __dirname
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// GALLERY UPLOAD DIRECTORY
// =====================================================

const uploadDir = path.join(
  __dirname,
  "..",
  "uploads",
  "gallery"
);

// =====================================================
// CREATE DIRECTORY
// =====================================================

fs.mkdirSync(uploadDir, {
  recursive: true,
});

console.log(
  "Gallery upload directory:",
  uploadDir
);

// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const filename =
      `gallery-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
      ),
      false
    );
  }

  cb(null, true);
};

// =====================================================
// MULTER
// =====================================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;