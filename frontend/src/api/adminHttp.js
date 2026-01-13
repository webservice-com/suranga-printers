// ✅ frontend/src/api/adminHttp.js
import axios from "axios";

// ✅ single token key everywhere (keep legacy support optional)
export const TOKEN_KEY = "sp_admin_token";
const LEGACY_TOKEN_KEY = "admin_token";

// ✅ Base API URL must come from env on Netlify
// In local dev you can set it in frontend/.env
// VITE_API_URL=http://localhost:5000
const API = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");

if (!API) {
  // This will make the error obvious instead of silently calling localhost
  throw new Error("Missing VITE_API_URL. Add it in Netlify Environment Variables.");
}

// ✅ Admin base
export const ROOT_API = API;
export const ADMIN_API_BASE = `${ROOT_API}/api/admin`;

const adminHttp = axios.create({
  baseURL: ADMIN_API_BASE,
  timeout: 30000,
  withCredentials: true, // keep true if you ever use cookies; safe even with JWT
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

    // ✅ DO NOT force Content-Type globally (FormData needs boundary)
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
      // Optional redirect:
      // window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default adminHttp;
