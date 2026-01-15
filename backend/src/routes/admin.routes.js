const router = require("express").Router();

const { auth, adminOnly } = require("../middleware/auth");
const c = require("../controllers/admin.controller");
const { uploadPortfolioImage, uploadServiceImage } = require("../middleware/upload");

/* ======================
   PUBLIC
====================== */
router.post("/auth/login", c.login);

router.get("/health", (req, res) => {
  res.json({ ok: true, scope: "admin" });
});

/* ======================
   PROTECTED (ALL BELOW)
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
