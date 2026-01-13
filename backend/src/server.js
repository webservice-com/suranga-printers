// backend/src/server.js
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDB = require("./config/db");
const seedServices = require("./utils/seedServices");
const AdminUser = require("./models/AdminUser");

const publicRoutes = require("./routes/public.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* -------------------- CORS -------------------- */
/**
 * ✅ Put your Netlify frontend URLs here.
 * If you have multiple Netlify previews, add them too.
 */
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "http://localhost:8080",

  // ✅ Add your real Netlify domain(s) here:
  // "https://your-site.netlify.app",
]);

// ✅ Optional: allow env-based origins (comma separated)
if (process.env.FRONTEND_URL) {
  String(process.env.FRONTEND_URL)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .forEach((x) => allowedOrigins.add(x));
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman/curl
    if (allowedOrigins.has(origin)) return callback(null, true);

    return callback(
      new Error(
        `CORS policy does not allow access from Origin: ${origin}. Add it to allowedOrigins or FRONTEND_URL.`
      ),
      false
    );
  },

  /**
   * ✅ If your admin uses JWT in Authorization header, credentials can be false.
   * ✅ If your admin uses cookies/session, set true and also set allowedHeaders accordingly.
   */
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

/* -------------------- STATIC FILES -------------------- */
const uploadsDir = path.join(__dirname, "..", "uploads");

// ✅ This is what makes /uploads/... open in browser
app.use("/uploads", express.static(uploadsDir));

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Print & Design Services API",
    version: "1.0.0",
    endpoints: {
      public: "/api",
      admin: "/api/admin",
      health: "/api/health",
      uploads: "/uploads",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
    service: "Print Shop API",
    status: "running",
  });
});

/* -------------------- ROUTES -------------------- */
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

/* -------------------- 404 HANDLER -------------------- */
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

/* -------------------- ERROR HANDLER -------------------- */
app.use((error, req, res, next) => {
  console.error("❌ Error:", error?.message || error);

  // Multer errors
  if (error?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: true,
      message: "File too large. Maximum file size is 10MB",
    });
  }

  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      error: true,
      message: "Request entity too large",
    });
  }

  res.status(error.status || 500).json({
    error: true,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

/* -------------------- ADMIN SEEDER -------------------- */
async function ensureAdmin() {
  try {
    const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const pass = process.env.ADMIN_PASSWORD || "";

    if (!email || !pass) {
      console.log("⚠️ ADMIN_EMAIL / ADMIN_PASSWORD not set. Skipping admin creation.");
      return;
    }

    const exists = await AdminUser.findOne({ email });
    if (exists) {
      console.log("✅ Admin already exists:", email);
      return;
    }

    const passwordHash = await bcrypt.hash(pass, 12);
    await AdminUser.create({
      email,
      passwordHash,
      role: "admin",
      createdAt: new Date(),
    });

    console.log("✅ Admin user created:", email);
  } catch (err) {
    console.error("❌ Error creating admin user:", err?.message || err);
  }
}

/* -------------------- START SERVER -------------------- */
async function start() {
  try {
    console.log("🔄 Starting server...");

    const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
    const missingVars = requiredEnvVars.filter((name) => !process.env[name]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
    }

    console.log("📦 Connecting to MongoDB...");
    await connectDB(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    console.log("👤 Checking admin user...");
    await ensureAdmin();

    console.log("🌱 Seeding services...");
    try {
      await seedServices();
      console.log("✅ Services seeded");
    } catch (e) {
      console.log("⚠️ Service seeding skipped/failed:", e?.message || e);
    }

    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
      console.log(`\n🚀 Server started successfully!`);
      console.log(`✅ API URL: http://localhost:${port}`);
      console.log(`✅ Health check: http://localhost:${port}/api/health`);
      console.log(`📁 Uploads directory: ${uploadsDir}`);
      console.log(`🌍 CORS allowed origins: ${[...allowedOrigins].join(", ")}`);
      console.log(`⚙️  Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`\n📝 Ready to accept requests...\n`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Shutting down...`);
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Server failed to start:", error?.message || error);
    if (error?.stack) console.error(error.stack);
    process.exit(1);
  }
}

start();
