// ✅ frontend/src/admin/RequireAdmin.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const location = useLocation();

  const token =
    localStorage.getItem("sp_admin_token") || localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
