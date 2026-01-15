/* ================= SERVICES (UPDATED: HERO IMAGE SUPPORT) ================= */
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
      docData.heroImagePublicId = uploaded.public_id; // ✅ now stored in schema
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

    if (name !== undefined) item.name = toStr(name);
    if (category !== undefined) item.category = toStr(category) || "General";
    if (description !== undefined) item.description = toStr(description);
    if (featured !== undefined) item.featured = toBool(featured, item.featured);
    if (active !== undefined) item.active = toBool(active, item.active);

    if (req.file) {
      if (!req.file.buffer || req.file.size === 0) {
        return res.status(400).json({ message: "Empty file" });
      }

      if (item.heroImagePublicId) {
        try {
          await cloudinary.uploader.destroy(item.heroImagePublicId, { resource_type: "image" });
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
        await cloudinary.uploader.destroy(doc.heroImagePublicId, { resource_type: "image" });
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
