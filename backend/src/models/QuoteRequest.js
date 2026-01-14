// backend/src/models/QuoteRequest.js
const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    originalName: { type: String, default: "", trim: true },

    // Cloudinary secure_url (always https)
    url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => /^https?:\/\/.+/i.test(v),
        message: "Invalid file URL",
      },
    },

    // Cloudinary public_id (used for delete later)
    publicId: { type: String, required: true, trim: true },

    mimetype: { type: String, default: "", trim: true },
    size: { type: Number, default: 0, min: 0 },
  },
  { _id: false } // ✅ prevents extra _id per file item
);

const QuoteRequestSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },

    // ✅ Keep your enum, but also trim input in controllers
    contactMethod: {
      type: String,
      enum: ["Call", "WhatsApp"],
      default: "WhatsApp",
    },

    serviceName: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 1, min: 1 },

    size: { type: String, default: "", trim: true },
    color: { type: String, default: "", trim: true },
    paper: { type: String, default: "", trim: true },
    finishing: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true },

    fulfillment: {
      type: String,
      enum: ["Pickup", "Delivery"],
      default: "Pickup",
      index: true,
    },

    deliveryArea: { type: String, default: "", trim: true },
    deliveryFeeLkr: { type: Number, default: 0, min: 0 },

    // ✅ Cloudinary attachments (images + pdf)
    files: { type: [FileSchema], default: [] },

    status: {
      type: String,
      enum: [
        "Received",
        "Designing",
        "Printing",
        "Ready",
        "OutForDelivery",
        "Completed",
        "Cancelled",
      ],
      default: "Received",
      index: true,
    },

    adminNote: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

// ✅ Optional but helpful indexes for admin filtering
QuoteRequestSchema.index({ createdAt: -1 });
QuoteRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("QuoteRequest", QuoteRequestSchema);
