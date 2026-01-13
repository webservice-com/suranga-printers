// backend/src/utils/cloudinaryUpload.js
const cloudinary = require("../config/cloudinary");

/**
 * Uploads a file buffer to Cloudinary.
 * - Default: image upload (portfolio style optimization)
 * - Supports PDFs/other files by passing: { resource_type: "raw", folder: "quotes" }
 */
function uploadBufferToCloudinary(buffer, options = {}) {
  const resourceType = options.resource_type || "image";

  // ✅ Only apply transformations for images
  const transformation =
    resourceType === "image"
      ? [
          { width: 1400, height: 1400, crop: "limit" }, // limit huge images, keep quality
          { quality: "auto" },
          { fetch_format: "auto" },
        ]
      : undefined;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "uploads",
        resource_type: resourceType, // "image" | "raw" | "video"
        transformation,
        ...options, // allow overriding anything (public_id, tags, etc.)
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

module.exports = { uploadBufferToCloudinary };
