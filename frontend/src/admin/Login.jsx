// // ✅ frontend/src/admin/Login.jsx
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import adminHttp from "../api/adminHttp";

// export default function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const from = location.state?.from?.pathname || "/admin";

//   async function onSubmit(e) {
//     e.preventDefault();
//     setErr("");
//     setLoading(true);

//     try {
//       const res = await adminHttp.post("/auth/login", {
//         email,
//         password,
//       });

//       // backend could return token in different keys
//       const token =
//         res?.data?.token || res?.data?.accessToken || res?.data?.jwt || "";

//       if (!token) {
//         throw new Error("Token not returned from server");
//       }

//       // ✅ use one key everywhere
//       localStorage.setItem("sp_admin_token", token);

//       navigate(from, { replace: true });
//     } catch (error) {
//       const msg =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Login failed. Check email/password.";
//       setErr(msg);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
//         <h1 className="text-2xl font-extrabold mb-1">Admin Login</h1>
//         <p className="text-sm text-slate-600 mb-6">Sign in to manage the site</p>

//         {err ? (
//           <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
//             {err}
//           </div>
//         ) : null}

//         <form onSubmit={onSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold mb-1">Email</label>
//             <input
//               className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               autoComplete="username"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold mb-1">Password</label>
//             <input
//               className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               autoComplete="current-password"
//               required
//             />
//           </div>

//           <button
//             disabled={loading}
//             className="w-full rounded-xl bg-slate-900 text-white py-2 font-semibold disabled:opacity-60"
//             type="submit"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
// ✅ frontend/src/admin/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import adminHttp from "../api/adminHttp";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const from = location.state?.from?.pathname || "/admin";

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await adminHttp.post("/auth/login", {
        email,
        password,
      });

      // backend could return token in different keys
      const token =
        res?.data?.token || res?.data?.accessToken || res?.data?.jwt || "";

      if (!token) {
        throw new Error("Token not returned from server");
      }

      // ✅ use one key everywhere
      localStorage.setItem("sp_admin_token", token);

      navigate(from, { replace: true });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Check email/password.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-rose-100">
        {/* Header with theme colors */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 mb-4">
            <svg 
              className="w-8 h-8 text-rose-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Admin Login
          </h1>
          <p className="text-rose-700/70 font-medium">Sign in to manage the site</p>
        </div>

        {err ? (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm font-medium">
            <div className="flex items-center">
              <svg 
                className="w-5 h-5 mr-2 text-rose-600" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd"
                />
              </svg>
              {err}
            </div>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-rose-800 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className="h-5 w-5 text-rose-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 pl-10 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 bg-rose-50/50 transition-all duration-200"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-rose-800 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className="h-5 w-5 text-amber-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                className="w-full rounded-xl border-2 border-amber-100 px-4 py-3 pl-10 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-amber-50/50 transition-all duration-200"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white py-3 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            type="submit"
          >
            <div className="flex items-center justify-center">
              {loading ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg 
                    className="ml-2 w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </>
              )}
            </div>
          </button>
        </form>

        {/* Decorative elements */}
        <div className="mt-8 pt-6 border-t border-rose-100 text-center">
          <p className="text-sm text-rose-700/60 font-medium">
            Secure access to administration panel
          </p>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-rose-200 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-200 rounded-full translate-x-20 translate-y-20 opacity-20"></div>
      </div>
    </div>
  );
}