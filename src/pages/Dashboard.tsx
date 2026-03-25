import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Heart, Clock, User, LogOut, PenLine } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const brandCurve = [0.22, 1, 0.36, 1] as const;

const navItems = [
  { to: "/dashboard/stories", icon: PenLine, label: "Minhas Histórias" },
  { to: "/dashboard/favorites", icon: Heart, label: "Favoritos" },
  { to: "/dashboard/reading", icon: Clock, label: "Histórico de Leitura" },
  { to: "/dashboard/account", icon: User, label: "Minha Conta" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user?.name
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="min-h-screen pt-14 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: brandCurve }}
        className="hidden md:flex flex-col w-64 fixed left-0 top-14 bottom-0 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] px-4 py-6"
      >
        {/* User info */}
        <div className="flex items-center gap-3 px-2 mb-8">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-display font-bold text-sm">{initials}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-display font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium transition-colors ${
                  isActive
                    ? "bg-[hsl(var(--sidebar-accent))] text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--sidebar-accent))]"
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="space-y-1 pt-4 border-t border-[hsl(var(--sidebar-border))]">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            Descobrir histórias
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sair
          </button>
        </div>
      </motion.aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[hsl(var(--sidebar-background))] border-t border-[hsl(var(--sidebar-border))] flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-display">{label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 pb-24 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
}
