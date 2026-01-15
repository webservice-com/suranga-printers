// backend/src/routes/admin.routes.js
const router = require("express").Router();

// ✅ use explicit .js to avoid path mismatch issues on deploy
const authMod = require("../middleware/auth.js");
const c = require("../controllers/admin.controller.js");
const uploadMod = require("../middleware/upload.js");

// ------------------ SAFETY CHECKS (shows real missing handler) ------------------
function mustBeFn(fn, name) {
  if (typeof fn !== "function") {
    throw new Error(`❌ Route handler missing/not a function: ${name}`);
  }
}

mustBeFn(c.login, "c.login");

mustBeFn(authMod.auth, "authMod.auth");
mustBeFn(authMod.adminOnly, "authMod.adminOnly");

mustBeFn(uploadMod.uploadPortfolioImage, "uploadMod.uploadPortfolioImage");
mustBeFn(uploadMod.uploadServiceImage, "uploadMod.uploadServiceImage");

// Destructure AFTER validation
const { auth, adminOnly } = authMod;
const { uploadPortfolioImage, uploadServiceImage } = uploadMod;

/* ======================
   PUBLIC
====================== */
router.post("/auth/login", c.login);

router.get("/health", (req, res) => {
  res.json({ ok: true, scope: "admin" });
});

/* ======================
   PROTECTED
====================== */
router.use(auth, adminOnly);

router.get("/me", (req, res) => {
  res.json({ ok: true, admin: req.user || null });
});

/* ======================
   SERVICES (with image upload)
====================== */
router.get("/services", c.adminGetServices);
router.post("/services", uploadServiceImage, c.adminCreateService);
router.put("/services/:id", uploadServiceImage, c.adminUpdateService);
router.delete("/services/:id", c.adminDeleteService);

/* ======================
   DELIVERY AREAS
====================== */
router.get("/delivery-areas", c.adminGetDeliveryAreas);
router.post("/delivery-areas", c.adminCreateDeliveryArea);
router.put("/delivery-areas/:id", c.adminUpdateDeliveryArea);
router.delete("/delivery-areas/:id", c.adminDeleteDeliveryArea);

/* ======================
   QUOTES
====================== */
router.get("/quotes", c.adminGetQuotes);
router.patch("/quotes/:id", c.adminUpdateQuote);

/* ======================
   REVIEWS
====================== */
router.get("/reviews", c.adminGetReviews);
router.patch("/reviews/:id", c.adminUpdateReview);
router.delete("/reviews/:id", c.adminDeleteReview);

/* ======================
   PORTFOLIO (Cloudinary)
====================== */
router.get("/portfolio", c.adminGetPortfolio);
router.post("/portfolio", uploadPortfolioImage, c.adminCreatePortfolio);
router.put("/portfolio/:id", uploadPortfolioImage, c.adminUpdatePortfolio);
router.delete("/portfolio/:id", c.adminDeletePortfolio);

/* ======================
   SETTINGS
====================== */
router.get("/settings", c.adminGetSettings);
router.put("/settings", c.adminUpdateSettings);

module.exports = router;
