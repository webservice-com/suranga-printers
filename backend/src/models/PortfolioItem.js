// backend/src/models/PortfolioItem.js
const mongoose = require("mongoose");

const PortfolioItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    category: { type: String, default: "General", index: true, trim: true },
    tag: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },

    // ✅ Cloudinary image URL (secure_url)
    imageUrl: { type: String, required: true },

    // ✅ Cloudinary public_id (needed to delete/replace images)
    imagePublicId: { type: String, required: true, index: true },

    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PortfolioItem", PortfolioItemSchema);
