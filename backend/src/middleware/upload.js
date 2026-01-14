// backend/src/middleware/upload.js
const multer = require("multer");

/* ======================================================
   SHARED HELPERS
====================================================== */
function makeAllowedFilter(allowed, message) {
  const set = new Set(allowed);
  return (req, file, cb) => {
    if (!set.has(file.mimetype)) {
      return cb(new Error(message));
    }
    cb(null, true);
  };
}

/* ======================================================
   1) PORTFOLIO (Cloudinary) -> memoryStorage (buffer)
====================================================== */
const portfolioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: makeAllowedFilter(
    ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
    "Only JPG, PNG, WebP, GIF, SVG images are allowed."
  ),
});

// field name must match frontend: fd.append("image", image)
const uploadPortfolioImage = portfolioUpload.single("image");

/* ======================================================
   2) QUOTES (Cloudinary files: images + pdf + docs) -> memoryStorage (buffer)
   ✅ Must be memoryStorage because your controller uses f.buffer
====================================================== */
const quoteUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB each file
    files: 5, // max 5 files
  },
  fileFilter: makeAllowedFilter(
    [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/zip",
      "text/plain",
    ],
    "File type not allowed."
  ),
});

// field name must match frontend: fd.append("files", files[])
const uploadQuoteFiles = quoteUpload.array("files", 5);

module.exports = {
  uploadPortfolioImage,
  uploadQuoteFiles,
};
