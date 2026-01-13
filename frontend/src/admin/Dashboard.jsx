import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  Home,
  Package,
  Printer,
  Truck,
  Image,
  MessageSquare,
  Settings,
  Menu,
  X,
  ChevronRight,
  Shield,
  Bell,
  User,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";

const TOKEN_KEY = "sp_admin_token";

export default function AdminLayout() {
  const nav = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    nav("/admin/login");
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { path: "/admin/quotes", label: "Quotes", icon: <Package className="w-4 h-4" /> },
    { path: "/admin/services", label: "Services", icon: <Printer className="w-4 h-4" /> },
    { path: "/admin/delivery", label: "Delivery", icon: <Truck className="w-4 h-4" /> },
    { path: "/admin/portfolio", label: "Portfolio", icon: <Image className="w-4 h-4" /> },
    { path: "/admin/reviews", label: "Reviews", icon: <MessageSquare className="w-4 h-4" /> },
    { path: "/admin/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const getPageTitle = () => {
    const item = navItems.find((i) => location.pathname === i.path);
    if (item) return item.label;
    if (location.pathname.startsWith("/admin/portfolio")) return "Portfolio";
    if (location.pathname.startsWith("/admin/quotes")) return "Quotes";
    if (location.pathname.startsWith("/admin/services")) return "Services";
    if (location.pathname.startsWith("/admin/delivery")) return "Delivery";
    if (location.pathname.startsWith("/admin/reviews")) return "Reviews";
    if (location.pathname.startsWith("/admin/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container-pad py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Admin Panel</div>
                  <div className="text-xs text-slate-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Suranga Printers – Fast Print
                  </div>
                </div>
              </div>
            </div>

            {/* Center */}
            <div className="hidden md:block flex-1 px-6">
              <div className="flex items-center gap-2 text-slate-900">
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-lg">{getPageTitle()}</span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors group">
                <Bell className="w-5 h-5 text-slate-600 group-hover:text-red-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>

              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-900">Admin</span>
              </div>

              <button
                onClick={logout}
                className="group px-4 py-2.5 rounded-xl border-2 border-red-200 font-semibold hover:bg-red-50 hover:border-red-300 transition-all duration-300 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white animate-fade-in">
            <div className="container-pad py-4">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-red-50 to-red-50 border border-red-200 text-red-600"
                          : "hover:bg-slate-50 text-slate-700"
                      }`
                    }
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        location.pathname === item.path
                          ? "bg-red-100 text-red-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.icon}
                    </div>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r border-slate-200 bg-white/95 backdrop-blur-sm min-h-[calc(100vh-73px)] sticky top-[73px]">
          <div className="p-6">
            <div className="mb-6 px-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Navigation
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-sm"
                          : "hover:bg-slate-50 text-slate-700"
                      }`
                    }
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        location.pathname === item.path ? "bg-white/20" : "bg-slate-100 group-hover:bg-slate-200"
                      }`}
                    >
                      {item.icon}
                    </div>
                    {item.label}
                    {location.pathname === item.path && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="mt-8 px-2">
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Admin User</div>
                    <div className="text-xs text-slate-600">Full Access</div>
                  </div>
                </div>
                <div className="text-xs text-slate-700">Login required for all admin routes</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <div
            className={`container-pad py-8 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <span>Admin Panel</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-medium text-slate-900">{getPageTitle()}</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{getPageTitle()}</h1>
              <p className="text-slate-600 mt-2">
                Manage your printing business operations and customer interactions
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <Outlet />
            </div>

            <div className="mt-8 text-center text-sm text-slate-500">
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Suranga Printers Admin System • Secure Access</span>
              </div>
              <div className="mt-1 text-xs">Version 1.0</div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur-sm z-40">
        <nav className="flex justify-around p-2">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive ? "text-red-600" : "text-slate-600 hover:text-slate-900"
                }`
              }
            >
              <div className={`p-1.5 rounded-lg ${location.pathname === item.path ? "bg-red-50" : ""}`}>
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
