import { NavLink, Outlet, useNavigate } from "react-router-dom";

const linkClass = ({ isActive }) =>
  "px-3 py-2 rounded-xl text-sm font-semibold border " +
  (isActive
    ? "bg-slate-900 text-white border-slate-900"
    : "hover:bg-slate-50 border-slate-200 text-slate-800");

export default function AdminLayout() {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("sp_admin_token"); // ✅ single key
    nav("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container-pad py-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-extrabold">Admin Panel</div>
            <div className="text-xs text-slate-600">
              Suranga Printers – Fast Print
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            <NavLink to="/admin" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/quotes" className={linkClass}>
              Quotes
            </NavLink>
            <NavLink to="/admin/services" className={linkClass}>
              Services
            </NavLink>
            <NavLink to="/admin/delivery" className={linkClass}>
              Delivery
            </NavLink>
            <NavLink to="/admin/portfolio" className={linkClass}>
              Portfolio
            </NavLink>
            <NavLink to="/admin/reviews" className={linkClass}>
              Reviews
            </NavLink>
            <NavLink to="/admin/settings" className={linkClass}>
              Settings
            </NavLink>
          </nav>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border font-semibold hover:bg-slate-50 border-slate-200"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container-pad py-8">
        <Outlet />
      </main>
    </div>
  );
}
