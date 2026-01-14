// ✅ frontend/src/api/publicHttp.js
import axios from "axios";

// ✅ Read API base from env (Netlify / local .env)
// Examples:
//   VITE_API_URL=http://localhost:5000
//   VITE_API_URL=https://your-backend.onrender.com
const rawAPI = (import.meta.env.VITE_API_URL || "").trim();
const ROOT_API = rawAPI.replace(/\/+$/, ""); // remove trailing slashes

// ❗ DO NOT throw here (throws break production build on Netlify)
// Instead log a clear error and allow same-origin fallback.
if (!ROOT_API) {
  // eslint-disable-next-line no-console
  console.error(
    "❌ Missing VITE_API_URL. Add it in Netlify Environment Variables (or frontend/.env for local dev). " +
      "Public API requests may fail if backend is not same-origin."
  );
}

// ✅ Export ROOT_API (used by file links, images, etc.)
export { ROOT_API };

// ✅ Public API client
const publicHttp = axios.create({
  baseURL: `${ROOT_API || ""}/api`, // fallback to same-origin if empty
  timeout: 30000,
  withCredentials: false, // JWT not used for public routes
});

// (Optional) response interceptor for logging
publicHttp.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
);

export default publicHttp;
