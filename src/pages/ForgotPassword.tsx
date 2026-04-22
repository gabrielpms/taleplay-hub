import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Loader2, MailCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const brandCurve = [0.22, 1, 0.36, 1] as const;

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string; message?: string }).code;
      if (code === "auth/user-not-found" || code === "auth/invalid-email") {
        setError("Informe um email válido cadastrado na plataforma.");
      } else if ((err as { message?: string }).message === "Auth not configured") {
        setError("A recuperação de senha ainda não está configurada.");
      } else {
        setError("Não foi possível enviar o email. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: brandCurve }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="flex items-center gap-2 justify-center mb-10">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-xl tracking-tight">StoryHub</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <MailCheck className="w-10 h-10 text-primary mx-auto mb-5" />
            <h1 className="font-display text-2xl font-bold mb-2">Confira seu email</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Enviamos um link para redefinir sua senha em {email}.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-display font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Voltar para login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold text-center mb-1">Recuperar senha</h1>
            <p className="text-muted-foreground text-sm text-center mb-8">
              Digite seu email para receber o link de redefinição
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-display font-medium block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-sm font-display placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              {error && <p className="text-primary text-xs font-display">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-display font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Enviar link
              </button>
            </form>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-6 font-display"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}