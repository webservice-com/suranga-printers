// backend/src/routes/public.routes.js
const router = require("express").Router();
const { uploadQuoteFiles } = require("../middleware/upload");
const c = require("../controllers/public.controller");

// ---------------------- PUBLIC ENDPOINTS ----------------------
// Base mounted in server.js as: app.use("/api", publicRoutes)
// So these become:
//   GET  /api/services
//   GET  /api/delivery-areas
//   POST /api/quotes
//   GET  /api/reviews
//   POST /api/reviews
//   GET  /api/portfolio
//   GET  /api/settings

router.get("/services", c.getServices);

router.get("/delivery-areas", c.getDeliveryAreas);

// ✅ Quote create + files upload
// Frontend must send FormData with field name: "files" (max 5)
router.post("/quotes", uploadQuoteFiles, c.createQuote);

router.get("/reviews", c.getReviews);
router.post("/reviews", c.createReview);

// ✅ PUBLIC portfolio (NO AUTH)
router.get("/portfolio", c.getPortfolio);

// ✅ PUBLIC settings (NO AUTH)
router.get("/settings", c.getPublicSettings);

module.exports = router;
