// ✅ frontend/src/api/publicHttp.js
import axios from "axios";

// ✅ Base API URL from env
const API = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");

if (!API) {
  throw new Error("Missing VITE_API_URL. Add it in Netlify Environment Variables.");
}

export const ROOT_API = API;

const publicHttp = axios.create({
  baseURL: `${ROOT_API}/api`, // ✅ PUBLIC ROUTES ONLY
  timeout: 30000,
  withCredentials: false,
});

export default publicHttp;
