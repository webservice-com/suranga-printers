// backend/src/middleware/upload.js
const multer = require("multer");

/**
 * ✅ Portfolio -> Cloudinary -> needs BUFFER
 * Use memoryStorage so req.file.buffer exists.
 */
const portfolioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ]);

    if (!allowed.has(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WebP, GIF, SVG images are allowed."));
    }
    cb(null, true);
  },
});

// ✅ IMPORTANT: field name must match frontend: fd.append("image", image)
const uploadPortfolioImage = portfolioUpload.single("image");

/**
 * ✅ Quotes -> can be disk OR memory (you already use uploadQuoteFiles)
 * If you upload quote files to Cloudinary too, convert this to memoryStorage similarly.
 */
const quoteUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB example
});

const uploadQuoteFiles = quoteUpload.array("files", 5);

module.exports = {
  uploadPortfolioImage,
  uploadQuoteFiles,
};
