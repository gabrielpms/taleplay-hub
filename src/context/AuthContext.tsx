import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (storyId: string) => void;
  isFavorite: (storyId: string) => boolean;
  readingHistory: ReadingEntry[];
  addToHistory: (storyId: string, episodeId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function toAppUser(firebaseUser: FirebaseUser): User {
  const isGoogle = firebaseUser.providerData.some(p => p.providerId === "google.com");
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuário",
    email: firebaseUser.email || "",
    avatar: firebaseUser.photoURL || undefined,
    provider: isGoogle ? "google" : "email",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingEntry[]>([]);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        const appUser = toAppUser(firebaseUser);
        setUser(appUser);
        setFavorites(JSON.parse(localStorage.getItem(`taleplay_favorites_${appUser.id}`) || "[]"));
        setReadingHistory(JSON.parse(localStorage.getItem(`taleplay_history_${appUser.id}`) || "[]"));
      } else {
        setUser(null);
        setFavorites([]);
        setReadingHistory([]);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Auth not configured");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (name: string, email: string, password: string) => {
    if (!auth) throw new Error("Auth not configured");
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    setUser(toAppUser({ ...credential.user, displayName: name } as FirebaseUser));
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error("Auth not configured");
    await sendPasswordResetEmail(auth, email);
  };

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) throw new Error("Auth not configured");
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
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
      user, loading, login, register, resetPassword, loginWithGoogle, logout,
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
