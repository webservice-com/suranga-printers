// backend/src/utils/cloudinaryUpload.js
const { cloudinary } = require("../config/cloudinary");

/**
 * Uploads a file buffer to Cloudinary.
 * - Default image upload with optimization transformations
 * - Use { resource_type: "raw" } for PDFs/docs
 */
function uploadBufferToCloudinary(buffer, options = {}) {
  const resourceType = options.resource_type || "image";

  const transformation =
    resourceType === "image"
      ? [
          { width: 1400, height: 1400, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ]
      : undefined;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "uploads",
        resource_type: resourceType,
        transformation,
        ...options,
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
