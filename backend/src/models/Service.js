// backend/src/models/Service.js
const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "General", trim: true },
    description: { type: String, default: "", trim: true },

    // ✅ NEW: hero image (Cloudinary URL)
    heroImage: { type: String, default: "", trim: true },

    // ✅ NEW: hero image public id (for delete/replace)
    heroImagePublicId: { type: String, default: "", trim: true },

    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
