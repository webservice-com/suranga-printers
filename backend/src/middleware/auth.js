// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

function getBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || "";
  if (!header) return null;

  // Accept: "Bearer <token>" (case-insensitive)
  const parts = header.split(" ");
  if (parts.length === 2 && /^bearer$/i.test(parts[0])) {
    return parts[1].trim();
  }
  return null;
}

function auth(req, res, next) {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "JWT_SECRET is missing in .env" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, role, ... } whatever you signed
    return next();
  } catch (err) {
    // optional: differentiate expiry vs invalid
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  // Must run AFTER auth()
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const role = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  return next();
}

module.exports = { auth, adminOnly };
