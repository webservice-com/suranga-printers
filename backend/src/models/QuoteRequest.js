// backend/src/models/QuoteRequest.js
const mongoose = require("mongoose");

const QuoteRequestSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    contactMethod: { type: String, enum: ["Call", "WhatsApp"], default: "WhatsApp" },

    serviceName: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 1 },
    size: { type: String, default: "", trim: true },
    color: { type: String, default: "", trim: true },
    paper: { type: String, default: "", trim: true },
    finishing: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true },

    fulfillment: { type: String, enum: ["Pickup", "Delivery"], default: "Pickup" },
    deliveryArea: { type: String, default: "", trim: true },
    deliveryFeeLkr: { type: Number, default: 0 },

    // ✅ Cloudinary attachments (images + pdf)
    files: [
      {
        originalName: { type: String, default: "" }, // user file name
        url: { type: String, required: true },       // Cloudinary secure_url
        publicId: { type: String, required: true },  // Cloudinary public_id (for delete later)
        mimetype: { type: String, default: "" },
        size: { type: Number, default: 0 },
      },
    ],

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

module.exports = mongoose.model("QuoteRequest", QuoteRequestSchema);
