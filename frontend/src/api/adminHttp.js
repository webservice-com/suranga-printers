// ✅ frontend/src/api/adminHttp.js
import axios from "axios";

// If your env is empty => default localhost backend
const DEFAULT_BACKEND = "http://localhost:5000";

// ✅ single token key everywhere (keep legacy support optional)
export const TOKEN_KEY = "sp_admin_token";
const LEGACY_TOKEN_KEY = "admin_token";

function normalizeBaseUrl(raw) {
  let u = String(raw || "").trim();

  // allow formats like ":5000"
  if (u.startsWith(":")) u = `http://localhost${u}`;

  // allow formats like "localhost:5000" or "127.0.0.1:5000"
  if (/^(localhost|127\.0\.0\.1)(:\d+)?/i.test(u)) u = `http://${u}`;

  // if user puts only domain "example.com" -> https://example.com
  if (u && !/^https?:\/\//i.test(u)) u = `https://${u}`;

  // fallback
  if (!u) u = DEFAULT_BACKEND;

  // remove trailing slashes
  return u.replace(/\/+$/, "");
}

export const ROOT_API = normalizeBaseUrl(import.meta.env.VITE_API_BASE);

// ✅ Admin base (IMPORTANT)
export const ADMIN_API_BASE = `${ROOT_API}/api/admin`;

const adminHttp = axios.create({
  baseURL: ADMIN_API_BASE,
  timeout: 30000,
});

// ✅ request interceptor: attach token
adminHttp.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ DO NOT force Content-Type globally
    // If request body is FormData, axios will set proper boundary automatically.
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ response interceptor: handle 401
adminHttp.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);

      // Optional: if you want auto redirect from anywhere:
      // window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default adminHttp;
