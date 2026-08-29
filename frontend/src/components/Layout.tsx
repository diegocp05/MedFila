import { Outlet, Link, useLocation } from "react-router-dom";
import { Activity, LayoutDashboard, History, Users, LogOut, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Histórico", href: "/history", icon: History },
    ...(user?.role === "ADMIN" ? [{ name: "Painel Admin", href: "/admin", icon: Users }] : []),
  ];

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans text-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-zinc-100">
          <Activity className="w-6 h-6 text-teal-600 mr-3" />
          <span className="text-xl font-bold tracking-tight text-zinc-800">MediBridge</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-teal-600" : "text-zinc-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <div className="flex items-center px-3 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold mr-3">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-900">{user?.name}</span>
              <span className="text-xs text-zinc-500">{user?.role === "ADMIN" ? "Administrador" : "Médico"}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
