// backend/src/controllers/admin.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const AdminUser = require("../models/AdminUser");
const Service = require("../models/Service");
const DeliveryArea = require("../models/DeliveryArea");
const QuoteRequest = require("../models/QuoteRequest");
const Review = require("../models/Review");
const PortfolioItem = require("../models/PortfolioItem");
const Settings = require("../models/Settings");

// ✅ IMPORTANT: must export { cloudinary, uploadBuffer } from config/cloudinary.js
const { cloudinary, uploadBuffer } = require("../config/cloudinary");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const toStr = (v) => String(v ?? "").trim();
const toBool = (v, defaultValue = false) => {
  if (v === undefined || v === null) return defaultValue;
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase().trim();
  return s === "true" || s === "1" || s === "yes" || s === "on";
};

/* ================= AUTH ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = toStr(email).toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await AdminUser.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is missing in .env" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, email: user.email, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

/* ================= SERVICES (HERO IMAGE SUPPORT) ================= */
exports.adminGetServices = async (_req, res) => {
  try {
    const items = await Service.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    console.error("Get services error:", error);
    return res.status(500).json({ message: "Failed to load services" });
  }
};

exports.adminCreateService = async (req, res) => {
  try {
    const { name, category, description, featured, active } = req.body || {};

    if (!toStr(name)) {
      return res.status(400).json({ message: "Service name is required" });
    }

    const docData = {
      name: toStr(name),
      category: toStr(category) || "General",
      description: toStr(description),
      featured: toBool(featured, false),
      active: toBool(active, true),
    };

    // ✅ optional hero image upload (multipart/form-data "image")
    if (req.file) {
      if (!req.file.buffer || req.file.size === 0) {
        return res.status(400).json({ message: "Empty file" });
      }

      const uploaded = await uploadBuffer({
        buffer: req.file.buffer,
        folder: "services",
        resourceType: "image",
      });

      docData.heroImage = uploaded.secure_url;
      docData.heroImagePublicId = uploaded.public_id;
    }

    const doc = await Service.create(docData);
    return res.status(201).json(doc);
  } catch (error) {
    console.error("Create service error:", error);
    return res.status(400).json({ message: error?.message || "Create service failed" });
  }
};

exports.adminUpdateService = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const item = await Service.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    const { name, category, description, featured, active } = req.body || {};

    // ✅ safer: if name provided, it must not be empty
    if (name !== undefined) {
      const n = toStr(name);
      if (!n) return res.status(400).json({ message: "Service name is required" });
      item.name = n;
    }

    if (category !== undefined) item.category = toStr(category) || "General";
    if (description !== undefined) item.description = toStr(description);
    if (featured !== undefined) item.featured = toBool(featured, item.featured);
    if (active !== undefined) item.active = toBool(active, item.active);

    // ✅ replace hero image if new file uploaded
    if (req.file) {
      if (!req.file.buffer || req.file.size === 0) {
        return res.status(400).json({ message: "Empty file" });
      }

      if (item.heroImagePublicId) {
        try {
          await cloudinary.uploader.destroy(item.heroImagePublicId, {
            resource_type: "image",
          });
        } catch (err) {
          console.warn("Failed to delete old service image:", err.message);
        }
      }

      const uploaded = await uploadBuffer({
        buffer: req.file.buffer,
        folder: "services",
        resourceType: "image",
      });

      item.heroImage = uploaded.secure_url;
      item.heroImagePublicId = uploaded.public_id;
    }

    await item.save();
    return res.json(item);
  } catch (error) {
    console.error("Update service error:", error);
    return res.status(400).json({ message: error?.message || "Update service failed" });
  }
};

exports.adminDeleteService = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const doc = await Service.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    if (doc.heroImagePublicId) {
      try {
        await cloudinary.uploader.destroy(doc.heroImagePublicId, {
          resource_type: "image",
        });
      } catch (err) {
        console.warn("Failed to delete service image from Cloudinary:", err.message);
      }
    }

    await doc.deleteOne();
    return res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete service error:", error);
    return res.status(500).json({ message: "Delete service failed" });
  }
};

/* ================= DELIVERY AREAS ================= */
exports.adminGetDeliveryAreas = async (_req, res) => {
  try {
    const items = await DeliveryArea.find({ district: "Matale" }).sort({ area: 1 });
    return res.json(items);
  } catch (error) {
    console.error("Get delivery areas error:", error);
    return res.status(500).json({ message: "Failed to load delivery areas" });
  }
};

exports.adminCreateDeliveryArea = async (req, res) => {
  try {
    const payload = { ...(req.body || {}), district: "Matale" };
    const doc = await DeliveryArea.create(payload);
    return res.status(201).json(doc);
  } catch (error) {
    console.error("Create delivery area error:", error);
    return res.status(400).json({ message: error?.message || "Create delivery area failed" });
  }
};

exports.adminUpdateDeliveryArea = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const doc = await DeliveryArea.findByIdAndUpdate(req.params.id, req.body || {}, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json(doc);
  } catch (error) {
    console.error("Update delivery area error:", error);
    return res.status(400).json({ message: error?.message || "Update delivery area failed" });
  }
};

exports.adminDeleteDeliveryArea = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const doc = await DeliveryArea.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete delivery area error:", error);
    return res.status(500).json({ message: "Delete delivery area failed" });
  }
};

/* ================= QUOTES ================= */
exports.adminGetQuotes = async (req, res) => {
  try {
    const { status } = req.query || {};
    const filter = status ? { status } : {};
    const items = await QuoteRequest.find(filter).sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    console.error("Get quotes error:", error);
    return res.status(500).json({ message: "Failed to load quotes" });
  }
};

exports.adminUpdateQuote = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const allowed = ["status", "adminNote", "deliveryFeeLkr"];
    const body = req.body || {};
    const patch = {};
    for (const k of allowed) if (k in body) patch[k] = body[k];

    const doc = await QuoteRequest.findByIdAndUpdate(req.params.id, patch, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json(doc);
  } catch (error) {
    console.error("Update quote error:", error);
    return res.status(400).json({ message: error?.message || "Update quote failed" });
  }
};

/* ================= REVIEWS ================= */
exports.adminGetReviews = async (_req, res) => {
  try {
    const items = await Review.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({ message: "Failed to load reviews" });
  }
};

exports.adminUpdateReview = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const allowed = ["approved", "featured"];
    const body = req.body || {};
    const patch = {};
    for (const k of allowed) if (k in body) patch[k] = body[k];

    const doc = await Review.findByIdAndUpdate(req.params.id, patch, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json(doc);
  } catch (error) {
    console.error("Update review error:", error);
    return res.status(400).json({ message: error?.message || "Update review failed" });
  }
};

exports.adminDeleteReview = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const doc = await Review.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({ message: "Delete review failed" });
  }
};

/* ================= PORTFOLIO (Cloudinary) ================= */
exports.adminGetPortfolio = async (_req, res) => {
  try {
    const items = await PortfolioItem.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    console.error("Get portfolio error:", error);
    return res.status(500).json({ message: "Failed to load portfolio" });
  }
};

exports.adminCreatePortfolio = async (req, res) => {
  try {
    const { title, category, tag, description, featured, active } = req.body || {};
    if (!toStr(title)) return res.status(400).json({ message: "Title is required" });

    if (!req.file || !req.file.buffer || req.file.size === 0) {
      return res.status(400).json({ message: "Empty file (image is required)" });
    }

    const uploaded = await uploadBuffer({
      buffer: req.file.buffer,
      folder: "portfolio",
      resourceType: "image",
    });

    const doc = await PortfolioItem.create({
      title: toStr(title),
      category: toStr(category) || "General",
      tag: toStr(tag),
      description: toStr(description),
      imageUrl: uploaded.secure_url,
      imagePublicId: uploaded.public_id,
      featured: toBool(featured, false),
      active: toBool(active, true),
    });

    return res.status(201).json(doc);
  } catch (error) {
    console.error("Create portfolio error:", error);
    return res.status(400).json({ message: error?.message || "Save failed" });
  }
};

exports.adminUpdatePortfolio = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const item = await PortfolioItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    const { title, category, tag, description, featured, active } = req.body || {};

    if (title !== undefined) item.title = toStr(title);
    if (category !== undefined) item.category = toStr(category) || "General";
    if (tag !== undefined) item.tag = toStr(tag);
    if (description !== undefined) item.description = toStr(description);
    if (featured !== undefined) item.featured = toBool(featured, item.featured);
    if (active !== undefined) item.active = toBool(active, item.active);

    if (req.file) {
      if (!req.file.buffer || req.file.size === 0) {
        return res.status(400).json({ message: "Empty file" });
      }

      if (item.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(item.imagePublicId, {
            resource_type: "image",
          });
        } catch (err) {
          console.warn("Failed to delete old image from Cloudinary:", err.message);
        }
      }

      const uploaded = await uploadBuffer({
        buffer: req.file.buffer,
        folder: "portfolio",
        resourceType: "image",
      });

      item.imageUrl = uploaded.secure_url;
      item.imagePublicId = uploaded.public_id;
    }

    await item.save();
    return res.json(item);
  } catch (error) {
    console.error("Update portfolio error:", error);
    return res.status(400).json({ message: error?.message || "Update failed" });
  }
};

exports.adminDeletePortfolio = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const doc = await PortfolioItem.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    if (doc.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(doc.imagePublicId, {
          resource_type: "image",
        });
      } catch (err) {
        console.warn("Failed to delete image from Cloudinary:", err.message);
      }
    }

    await doc.deleteOne();
    return res.json({ ok: true });
  } catch (error) {
    console.error("Delete portfolio error:", error);
    return res.status(500).json({ message: "Delete failed" });
  }
};

/* ================= SETTINGS ================= */
async function getOrCreateSettings() {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
}

exports.adminGetSettings = async (_req, res) => {
  try {
    const s = await getOrCreateSettings();
    return res.json(s);
  } catch (error) {
    console.error("Get settings error:", error);
    return res.status(500).json({ message: error?.message || "Failed to load settings" });
  }
};

exports.adminUpdateSettings = async (req, res) => {
  try {
    const body = req.body || {};
    const s = await getOrCreateSettings();

    const cleanDigits = (v) => String(v || "").replace(/\D/g, "");
    const cleanStr = (v) => String(v ?? "").trim();

    const allowed = [
      "shopName",
      "phone",
      "whatsapp",
      "address",
      "hoursMonSat",
      "hoursSunday",
      "social",
    ];

    const patch = {};
    for (const k of allowed) {
      if (k in body) patch[k] = body[k];
    }

    if ("shopName" in patch) patch.shopName = cleanStr(patch.shopName);
    if ("address" in patch) patch.address = cleanStr(patch.address);
    if ("hoursMonSat" in patch) patch.hoursMonSat = cleanStr(patch.hoursMonSat);
    if ("hoursSunday" in patch) patch.hoursSunday = cleanStr(patch.hoursSunday);

    if ("phone" in patch) patch.phone = cleanDigits(patch.phone);
    if ("whatsapp" in patch) patch.whatsapp = cleanDigits(patch.whatsapp);

    if ("social" in patch) {
      const social = patch.social || {};
      patch.social = {
        facebook: cleanStr(social.facebook),
        instagram: cleanStr(social.instagram),
        twitter: cleanStr(social.twitter),
        youtube: cleanStr(social.youtube),
        tiktok: cleanStr(social.tiktok),
        website: cleanStr(social.website),
      };
    }

    const updated = await Settings.findByIdAndUpdate(s._id, patch, {
      new: true,
      runValidators: true,
    });

    return res.json({ message: "Settings saved", settings: updated });
  } catch (error) {
    console.error("Update settings error:", error);
    return res.status(400).json({ message: error?.message || "Update failed" });
  }
};
