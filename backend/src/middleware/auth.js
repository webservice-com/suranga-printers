// ✅ backend/middleware/auth.js
const jwt = require("jsonwebtoken");

/**
 * Get JWT from:
 *  1) Authorization: Bearer <token>
 *  2) Cookie (optional): sp_admin_token=<token>
 */
function getToken(req) {
  // 1) Authorization header
  const raw =
    req.headers.authorization ||
    req.headers.Authorization ||
    "";

  if (typeof raw === "string" && raw.trim()) {
    // supports: "Bearer <token>" (case-insensitive) + extra spaces
    const match = raw.trim().match(/^Bearer\s+(.+)$/i);
    if (match && match[1]) return match[1].trim();
  }

  // 2) Cookie token (ONLY if you later use cookies)
  // requires cookie-parser middleware to populate req.cookies
  if (req.cookies) {
    const cookieToken =
      req.cookies.sp_admin_token ||
      req.cookies.admin_token; // legacy fallback
    if (cookieToken) return String(cookieToken).trim();
  }

  return null;
}

function auth(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized (missing token)" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Server misconfigured: JWT_SECRET missing" });
  }

  try {
    const decoded = jwt.verify(token, secret);

    // decoded normally contains: { id, role, email, iat, exp }
    req.user = decoded;

    return next();
  } catch (err) {
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden (admin only)" });
  }

  return next();
}

module.exports = { auth, adminOnly };
