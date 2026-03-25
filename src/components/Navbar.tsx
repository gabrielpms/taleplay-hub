import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Search, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isReader = location.pathname.startsWith("/read/");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isReader) return null;

  const initials = user?.name
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-8 md:px-16 lg:px-24">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-lg tracking-tight">StoryHub</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-display font-medium transition-colors ${location.pathname === "/" ? "text-foreground bg-surface" : "text-muted-foreground hover:text-foreground"}`}
          >
            Descobrir
          </Link>
          <button className="px-4 py-2 rounded-lg text-sm font-display font-medium text-muted-foreground hover:text-foreground transition-colors">
            Biblioteca
          </button>
          <button className="ml-2 w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface transition-colors">
            <Search className="w-4 h-4" />
          </button>

          {user ? (
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-surface transition-colors"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-display font-bold text-xs">{initials}</span>
                  </div>
                )}
                <span className="text-sm font-display font-medium hidden sm:block max-w-[100px] truncate">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[hsl(var(--card))] border border-border shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-display font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/dashboard"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-display text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); navigate("/"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-display text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 px-4 py-2 rounded-lg text-sm font-display font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
