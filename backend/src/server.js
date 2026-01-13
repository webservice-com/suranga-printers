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

/* ======================================================
   TRUST PROXY (REQUIRED FOR RENDER / NETLIFY)
====================================================== */
app.set("trust proxy", 1);

/* ======================================================
   MIDDLEWARE
====================================================== */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* ======================================================
   CORS CONFIG (LOCAL + NETLIFY + PREVIEWS)
====================================================== */
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "http://localhost:8080",
]);

// Add FRONTEND_URL from Render env (comma separated)
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .forEach((x) => allowedOrigins.add(x));
}

// Allow Netlify previews automatically
function isAllowedOrigin(origin) {
  if (!origin) return true; // Postman / server-to-server

  if (allowedOrigins.has(origin)) return true;

  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === "https:" && hostname.endsWith(".netlify.app");
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin: (origin, cb) =>
      isAllowedOrigin(origin)
        ? cb(null, true)
        : cb(new Error(`CORS blocked: ${origin}`)),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/* ======================================================
   STATIC FILES
====================================================== */
const uploadsDir = path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsDir));

/* ======================================================
   HEALTH & ROOT
====================================================== */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "Suranga Printers API",
    env: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    status: "running",
    time: new Date().toISOString(),
  });
});

/* ======================================================
   ROUTES
====================================================== */
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

/* ======================================================
   404 HANDLER
====================================================== */
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* ======================================================
   ERROR HANDLER
====================================================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message || err);

  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

/* ======================================================
   ADMIN SEEDER
====================================================== */
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("⚠️ Admin credentials not set. Skipping admin creation.");
    return;
  }

  const exists = await AdminUser.findOne({ email });
  if (exists) {
    console.log("✅ Admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUser.create({
    email,
    passwordHash,
    role: "admin",
    createdAt: new Date(),
  });

  console.log("✅ Admin user created");
}

/* ======================================================
   START SERVER
====================================================== */
async function start() {
  try {
    const required = ["MONGO_URI", "JWT_SECRET"];
    const missing = required.filter((k) => !process.env[k]);

    if (missing.length) {
      throw new Error(`Missing env vars: ${missing.join(", ")}`);
    }

    await connectDB(process.env.MONGO_URI);
    await ensureAdmin();

    try {
      await seedServices();
    } catch {
      console.log("⚠️ Service seeding skipped");
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log("🚀 Server running");
      console.log("🌍 Port:", PORT);
      console.log("🌐 Frontend:", process.env.FRONTEND_URL || "local only");
    });
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
}

start();
