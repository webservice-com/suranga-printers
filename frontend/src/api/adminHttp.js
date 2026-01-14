// ✅ frontend/src/api/adminHttp.js
import axios from "axios";

// ✅ token keys
export const TOKEN_KEY = "sp_admin_token";
const LEGACY_TOKEN_KEY = "admin_token";

// ✅ Read API base from env (Netlify / local .env)
// Examples:
//   VITE_API_URL=http://localhost:5000
//   VITE_API_URL=https://your-backend.onrender.com
const rawAPI = (import.meta.env.VITE_API_URL || "").trim();
const ROOT_API = rawAPI.replace(/\/+$/, ""); // remove trailing slashes

// ✅ If missing, DO NOT throw (throw breaks production build).
// Instead log a very clear error and fallback to same-origin.
// (Same-origin works only if frontend + backend are served from same domain.)
if (!ROOT_API) {
  // eslint-disable-next-line no-console
  console.error(
    "❌ Missing VITE_API_URL. Add it in Netlify Environment Variables (or frontend/.env for local dev). " +
      "Fallbacking to same-origin ''."
  );
}

// ✅ Export ROOT_API for link building
export { ROOT_API };

// ✅ Admin API base
export const ADMIN_API_BASE = `${ROOT_API || ""}/api/admin`;

const adminHttp = axios.create({
  baseURL: ADMIN_API_BASE,
  timeout: 30000,
  // ✅ If you are using JWT in Authorization header, you usually want false.
  // Set true ONLY if you are using cookies/sessions.
  withCredentials: false,
});

// ✅ Attach token to every request
adminHttp.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Do NOT set Content-Type globally (FormData needs boundary)
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle auth errors
adminHttp.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);

      // Optional redirect:
      // window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default adminHttp;
