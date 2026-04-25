import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlayCircle,
  BookOpen,
  Map,
  MessageCircle,
  BarChart3,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Accueil" },
  { to: "/session", icon: PlayCircle, label: "Session" },
  { to: "/cards", icon: BookOpen, label: "Cartes" },
  { to: "/programme", icon: Map, label: "Programme" },
  { to: "/conversation", icon: MessageCircle, label: "Parler" },
  { to: "/stats", icon: BarChart3, label: "Stats" },
];

export default function Navbar() {
  return (
    <>
      {/* Barre du bas — mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              <Icon size={22} strokeWidth={1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Sidebar — desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-50">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-blue-600">EnglishPro AI</h1>
          <p className="text-xs text-gray-500 mt-1">Vers le niveau B2+</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            EnglishPro AI v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
