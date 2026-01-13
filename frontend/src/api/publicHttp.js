// src/api/publicHttp.js
import axios from "axios";

const DEFAULT_BACKEND = "http://localhost:5000";

function normalizeBaseUrl(raw) {
  let u = String(raw || "").trim();

  // allow ":5000"
  if (u.startsWith(":")) u = `http://localhost${u}`;

  // allow "localhost:5000" or "127.0.0.1:5000"
  if (/^(localhost|127\.0\.0\.1)(:\d+)?/i.test(u)) {
    u = `http://${u}`;
  }

  // allow "example.com"
  if (u && !/^https?:\/\//i.test(u)) {
    u = `https://${u}`;
  }

  // fallback
  if (!u) u = DEFAULT_BACKEND;

  // remove trailing slashes
  return u.replace(/\/+$/, "");
}

export const ROOT_API = normalizeBaseUrl(import.meta.env.VITE_API_BASE);

const publicHttp = axios.create({
  baseURL: `${ROOT_API}/api`, // ✅ PUBLIC ROUTES ONLY
  timeout: 30000,
  withCredentials: false,
});

export default publicHttp;
