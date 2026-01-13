// ✅ frontend/src/App.jsx
import { HashRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Quote from "./pages/Quote";
import Portfolio from "./pages/Portfolio";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/Login";
import RequireAdmin from "./admin/RequireAdmin";

import Dashboard from "./admin/Dashboard";
import QuotesAdmin from "./admin/QuotesAdmin";
import ServicesAdmin from "./admin/ServicesAdmin";
import DeliveryAdmin from "./admin/DeliveryAdmin";
import PortfolioAdmin from "./admin/PortfolioAdmin";
import ReviewsAdmin from "./admin/ReviewsAdmin";
import SettingsAdmin from "./admin/SettingsAdmin";

/** ✅ Public layout to avoid repeating Navbar/Footer */
function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

/** ✅ Optional admin 404 page (simple) */
function AdminNotFound() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin page not found</h1>
      <p className="text-slate-600 mt-2">The admin route you visited does not exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* ================= ADMIN ================= */}
          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="quotes" element={<QuotesAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="delivery" element={<DeliveryAdmin />} />
            <Route path="portfolio" element={<PortfolioAdmin />} />
            <Route path="reviews" element={<ReviewsAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="*" element={<AdminNotFound />} />
          </Route>

          {/* ================= PUBLIC ================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </HashRouter>
  );
}
