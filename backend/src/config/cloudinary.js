// backend/src/config/cloudinary.js
const cloudinary = require("cloudinary").v2;

/* ======================================================
   CLOUDINARY CONFIG
====================================================== */
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn("⚠️ Cloudinary env vars are missing");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // ✅ ALWAYS use HTTPS URLs
});

/* ======================================================
   HELPERS (OPTIONAL BUT RECOMMENDED)
====================================================== */

/**
 * Upload buffer (from multer.memoryStorage)
 * Used for portfolio images
 */
async function uploadBuffer({
  buffer,
  folder,
  publicId,
  resourceType = "image",
}) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: resourceType,
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
}

/**
 * Delete by public_id (cleanup support)
 */
async function deleteFile(publicId, resourceType = "image") {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

module.exports = {
  cloudinary,
  uploadBuffer,
  deleteFile,
};
