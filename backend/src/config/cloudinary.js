// backend/src/config/cloudinary.js
const { v2: cloudinary } = require("cloudinary");

/**
 * Requires env vars:
 * CLOUDINARY_CLOUD_NAME
 * CLOUDINARY_API_KEY
 * CLOUDINARY_API_SECRET
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer to Cloudinary using upload_stream
 * @param {Object} opts
 * @param {Buffer} opts.buffer
 * @param {String} opts.folder
 * @param {"image"|"raw"|"video"} opts.resourceType
 */
function uploadBuffer({ buffer, folder = "uploads", resourceType = "image" }) {
  if (!buffer) throw new Error("uploadBuffer: buffer is required");

  const isImage = resourceType === "image";

  const uploadOptions = {
    folder,
    resource_type: resourceType,
  };

  // ✅ only apply transformations to images
  if (isImage) {
    uploadOptions.transformation = [
      { width: 1600, height: 1600, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ];
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    stream.end(buffer);
  });
}

module.exports = { cloudinary, uploadBuffer };
