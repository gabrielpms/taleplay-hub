import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "email" | "google";
}

export interface ReadingEntry {
  storyId: string;
  episodeId: string;
  readAt: string;
}

interface StoredUser extends User {
  password?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (storyId: string) => void;
  isFavorite: (storyId: string) => boolean;
  readingHistory: ReadingEntry[];
  addToHistory: (storyId: string, episodeId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("taleplay_user");
    if (stored) {
      const u: User = JSON.parse(stored);
      setUser(u);
      setFavorites(JSON.parse(localStorage.getItem(`taleplay_favorites_${u.id}`) || "[]"));
      setReadingHistory(JSON.parse(localStorage.getItem(`taleplay_history_${u.id}`) || "[]"));
    }
    setLoading(false);
  }, []);

  const persistSession = (u: User) => {
    setUser(u);
    localStorage.setItem("taleplay_user", JSON.stringify(u));
    setFavorites(JSON.parse(localStorage.getItem(`taleplay_favorites_${u.id}`) || "[]"));
    setReadingHistory(JSON.parse(localStorage.getItem(`taleplay_history_${u.id}`) || "[]"));
  };

  const login = async (email: string, password: string) => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem("taleplay_users") || "[]");
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Email ou senha incorretos.");
    const { password: _, ...u } = found;
    persistSession(u);
  };

  const register = async (name: string, email: string, password: string) => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem("taleplay_users") || "[]");
    if (users.find(u => u.email === email)) throw new Error("Email já cadastrado.");
    const newUser: User = { id: crypto.randomUUID(), name, email, provider: "email" };
    localStorage.setItem("taleplay_users", JSON.stringify([...users, { ...newUser, password }]));
    persistSession(newUser);
  };

  const loginWithGoogle = async () => {
    const mockUser: User = {
      id: "google_" + Date.now(),
      name: "Usuário Google",
      email: "usuario@gmail.com",
      avatar: "https://ui-avatars.com/api/?name=UG&background=4285F4&color=fff&size=64",
      provider: "google",
    };
    persistSession(mockUser);
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    setReadingHistory([]);
    localStorage.removeItem("taleplay_user");
  };

  const toggleFavorite = (storyId: string) => {
    if (!user) return;
    setFavorites(prev => {
      const updated = prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId];
      localStorage.setItem(`taleplay_favorites_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (storyId: string) => favorites.includes(storyId);

  const addToHistory = (storyId: string, episodeId: string) => {
    if (!user) return;
    setReadingHistory(prev => {
      const filtered = prev.filter(e => !(e.storyId === storyId && e.episodeId === episodeId));
      const updated = [{ storyId, episodeId, readAt: new Date().toISOString() }, ...filtered].slice(0, 50);
      localStorage.setItem(`taleplay_history_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, loginWithGoogle, logout,
      favorites, toggleFavorite, isFavorite,
      readingHistory, addToHistory,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
