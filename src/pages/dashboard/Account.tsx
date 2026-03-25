import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const brandCurve = [0.22, 1, 0.36, 1] as const;

export default function Account() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const initials = user?.name
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    const updatedUser = { ...user, name: name.trim() };
    localStorage.setItem("taleplay_user", JSON.stringify(updatedUser));
    // Update stored users list
    const users = JSON.parse(localStorage.getItem("taleplay_users") || "[]");
    const updated = users.map((u: typeof user & { password?: string }) =>
      u.id === user.id ? { ...u, name: name.trim() } : u
    );
    localStorage.setItem("taleplay_users", JSON.stringify(updated));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Minha Conta</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie suas informações pessoais</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: brandCurve }}
        className="space-y-6"
      >
        {/* Avatar */}
        <div className="flex items-center gap-4 p-5 rounded-xl bg-[hsl(var(--card))] border border-border">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-display font-bold text-xl">{initials}</span>
            </div>
          )}
          <div>
            <p className="font-display font-semibold">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="inline-block mt-1 label-caps text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-muted-foreground">
              {user?.provider === "google" ? "Google" : "Email"}
            </span>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave} className="p-5 rounded-xl bg-[hsl(var(--card))] border border-border space-y-4">
          <h2 className="font-display font-semibold text-base">Informações pessoais</h2>

          <div>
            <label className="text-sm font-display font-medium block mb-1.5">Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-sm font-display placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-display font-medium block mb-1.5">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-lg bg-surface/50 border border-border text-sm font-display text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">O email não pode ser alterado.</p>
          </div>

          <button
            type="submit"
            disabled={saving || saved}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-display font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-80"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saved && <Check className="w-4 h-4" />}
            {saved ? "Salvo!" : saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>

        {/* Danger zone */}
        <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
          <h2 className="font-display font-semibold text-base text-primary">Zona de perigo</h2>
          <p className="text-sm text-muted-foreground">
            Ao excluir sua conta, todos os seus dados serão removidos permanentemente.
          </p>
          <button
            onClick={() => {
              if (confirm("Tem certeza? Esta ação não pode ser desfeita.")) {
                localStorage.removeItem("taleplay_user");
                window.location.href = "/";
              }
            }}
            className="px-4 py-2 rounded-lg border border-primary/40 text-primary font-display font-medium text-sm hover:bg-primary/10 transition-colors"
          >
            Excluir conta
          </button>
        </div>
      </motion.div>
    </div>
  );
}
