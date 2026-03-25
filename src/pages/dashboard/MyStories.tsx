import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Plus, X, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const brandCurve = [0.22, 1, 0.36, 1] as const;

interface UserStory {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  createdAt: string;
}

function useUserStories(userId: string) {
  const key = `taleplay_mystories_${userId}`;
  const [stories, setStories] = useState<UserStory[]>(() =>
    JSON.parse(localStorage.getItem(key) || "[]")
  );

  const addStory = (data: Omit<UserStory, "id" | "createdAt">) => {
    const newStory: UserStory = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newStory, ...stories];
    setStories(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const removeStory = (id: string) => {
    const updated = stories.filter(s => s.id !== id);
    setStories(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  return { stories, addStory, removeStory };
}

export default function MyStories() {
  const { user } = useAuth();
  const { stories, addStory, removeStory } = useUserStories(user!.id);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [genre, setGenre] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addStory({ title: title.trim(), synopsis: synopsis.trim(), genre: genre.trim() });
    setTitle("");
    setSynopsis("");
    setGenre("");
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Minhas Histórias</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {stories.length} {stories.length === 1 ? "história criada" : "histórias criadas"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-display font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova história
        </button>
      </div>

      {/* Create form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: brandCurve }}
              className="w-full max-w-md bg-[hsl(var(--card))] border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-lg">Nova história</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-sm font-display font-medium block mb-1.5">Título</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    placeholder="O nome da sua história"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-sm font-display placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-display font-medium block mb-1.5">Gênero</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                    placeholder="Ex: Fantasia, Thriller, Romance..."
                    className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-sm font-display placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-display font-medium block mb-1.5">Sinopse</label>
                  <textarea
                    value={synopsis}
                    onChange={e => setSynopsis(e.target.value)}
                    placeholder="Do que se trata sua história?"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-sm font-display placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-surface border border-border font-display font-medium text-sm hover:bg-surface-hover transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-medium text-sm hover:bg-primary/90 transition-colors"
                  >
                    Criar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stories list */}
      {stories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: brandCurve }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-4">
            <PenLine className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-display font-semibold text-lg mb-1">Nenhuma história ainda</p>
          <p className="text-muted-foreground text-sm mb-6">Crie sua primeira história e comece a escrever</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-display font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Criar história
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: brandCurve }}
              className="group relative p-5 rounded-xl bg-[hsl(var(--card))] border border-border hover:border-border/80 transition-colors"
            >
              <button
                onClick={() => removeStory(story.id)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              {story.genre && (
                <span className="label-caps text-primary text-[10px] mb-1 block">{story.genre}</span>
              )}
              <h3 className="font-display font-semibold text-sm mb-1 line-clamp-2">{story.title}</h3>
              {story.synopsis && (
                <p className="text-xs text-muted-foreground line-clamp-3 mt-1">{story.synopsis}</p>
              )}
              <p className="text-[10px] text-muted-foreground/60 mt-3">
                {new Date(story.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
