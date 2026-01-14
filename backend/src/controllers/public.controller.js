// backend/src/controllers/public.controller.js
const Service = require("../models/Service");
const DeliveryArea = require("../models/DeliveryArea");
const QuoteRequest = require("../models/QuoteRequest");
const Review = require("../models/Review");
const PortfolioItem = require("../models/PortfolioItem");
const Settings = require("../models/Settings");

const { uploadBuffer } = require("../config/cloudinary");

async function getOrCreateSettings() {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
}

/* ================= SERVICES ================= */
exports.getServices = async (_req, res) => {
  try {
    const items = await Service.find({ active: true }).sort({ featured: -1, name: 1 });
    return res.json(items);
  } catch (error) {
    console.error("Get services error:", error);
    return res.status(500).json({ message: "Failed to load services" });
  }
};

/* ================= DELIVERY AREAS ================= */
exports.getDeliveryAreas = async (_req, res) => {
  try {
    const items = await DeliveryArea.find({ active: true, district: "Matale" }).sort({ area: 1 });
    return res.json(items);
  } catch (error) {
    console.error("Get delivery areas error:", error);
    return res.status(500).json({ message: "Failed to load delivery areas" });
  }
};

/* ================= QUOTE REQUEST (Cloudinary files) ================= */
exports.createQuote = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      customerName,
      phone,
      contactMethod,
      serviceName,
      quantity,
      size,
      color,
      paper,
      finishing,
      notes,
      fulfillment,
      deliveryArea,
      deliveryFeeLkr,
    } = body;

    if (!customerName || !phone || !serviceName) {
      return res.status(400).json({ message: "customerName, phone, serviceName are required" });
    }

    const fulfillmentNorm = String(fulfillment || "Pickup").trim();
    const isDelivery = fulfillmentNorm.toLowerCase() === "delivery";

    const uploadedFiles = [];
    const incoming = req.files || [];

    for (const f of incoming) {
      // ✅ FIX: only image/* goes as image, everything else goes as raw
      const isImage = typeof f.mimetype === "string" && f.mimetype.startsWith("image/");
      const resourceType = isImage ? "image" : "raw";

      const result = await uploadBuffer({
        buffer: f.buffer,
        folder: "quotes",
        resourceType,
      });

      uploadedFiles.push({
        originalName: f.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        mimetype: f.mimetype,
        size: f.size,
        resourceType, // helpful for frontend
      });
    }

    const doc = await QuoteRequest.create({
      customerName: String(customerName).trim(),
      phone: String(phone).trim(),
      contactMethod: contactMethod ? String(contactMethod).trim() : "WhatsApp",
      serviceName: String(serviceName).trim(),
      quantity: Number(quantity || 1),
      size: size || "",
      color: color || "",
      paper: paper || "",
      finishing: finishing || "",
      notes: notes || "",
      fulfillment: isDelivery ? "Delivery" : "Pickup",
      deliveryArea: isDelivery ? String(deliveryArea || "") : "",
      deliveryFeeLkr: isDelivery ? Number(deliveryFeeLkr || 0) : 0,
      files: uploadedFiles,
    });

    return res.status(201).json({ id: doc._id, message: "Quote request submitted" });
  } catch (error) {
    console.error("Create quote error:", error);
    return res.status(400).json({ message: error?.message || "Quote request failed" });
  }
};

/* ================= REVIEWS ================= */
exports.getReviews = async (_req, res) => {
  try {
    const items = await Review.find({ approved: true }).sort({ featured: -1, createdAt: -1 });
    return res.json(items);
  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({ message: "Failed to load reviews" });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { name, rating, message } = req.body || {};

    if (!name || rating == null || !message) {
      return res.status(400).json({ message: "name, rating, message are required" });
    }

    const r = Number(rating);
    if (Number.isNaN(r) || r < 1 || r > 5) {
      return res.status(400).json({ message: "rating must be a number from 1 to 5" });
    }

    const doc = await Review.create({
      name: String(name).trim(),
      rating: r,
      message: String(message).trim(),
    });

    return res.status(201).json({ id: doc._id, message: "Review submitted for approval" });
  } catch (error) {
    console.error("Create review error:", error);
    return res.status(400).json({ message: error?.message || "Review submit failed" });
  }
};

/* ================= PORTFOLIO ================= */
exports.getPortfolio = async (req, res) => {
  try {
    const { category } = req.query || {};
    const filter = { active: true };
    if (category && category !== "All") filter.category = category;

    const items = await PortfolioItem.find(filter).sort({ featured: -1, createdAt: -1 });
    return res.json(items);
  } catch (error) {
    console.error("Get portfolio error:", error);
    return res.status(500).json({ message: "Failed to load portfolio" });
  }
};

/* ================= SETTINGS (PUBLIC) ================= */
exports.getPublicSettings = async (_req, res) => {
  try {
    const s = await getOrCreateSettings();
    return res.json(s);
  } catch (error) {
    console.error("Get public settings error:", error);
    return res.status(500).json({ message: error?.message || "Failed to load settings" });
  }
};
