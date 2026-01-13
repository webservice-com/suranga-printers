const router = require("express").Router();

const { auth, adminOnly } = require("../middleware/auth");
const c = require("../controllers/admin.controller");
const { uploadPortfolioImage } = require("../middleware/upload");

/* ======================
   ADMIN ROUTES
   Mounted in server.js like:
   app.use("/api/admin", adminRoutes);
====================== */

/* ======================
   PUBLIC
====================== */
router.post("/auth/login", c.login);

// Optional (nice for quick test)
router.get("/health", (req, res) => {
  res.json({ ok: true, scope: "admin" });
});

/* ======================
   PROTECTED (ALL BELOW)
====================== */
router.use(auth, adminOnly);

// Optional (verify token works)
router.get("/me", (req, res) => {
  res.json({ ok: true, admin: req.user || null });
});

/* ======================
   SERVICES
====================== */
router.get("/services", c.adminGetServices);
router.post("/services", c.adminCreateService);
router.put("/services/:id", c.adminUpdateService);
router.delete("/services/:id", c.adminDeleteService);

/* ======================
   DELIVERY AREAS
====================== */
router.get("/delivery-areas", c.adminGetDeliveryAreas);
router.post("/delivery-areas", c.adminCreateDeliveryArea);
router.put("/delivery-areas/:id", c.adminUpdateDeliveryArea);
router.delete("/delivery-areas/:id", c.adminDeleteDeliveryArea);

/* ======================
   QUOTES / ORDERS
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
