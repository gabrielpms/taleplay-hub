import { Link, useLocation } from "react-router-dom";
import { BookOpen, Search, Library } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const isReader = location.pathname.startsWith("/read/");

  if (isReader) return null;

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
        </div>
      </div>
    </nav>
  );
}
