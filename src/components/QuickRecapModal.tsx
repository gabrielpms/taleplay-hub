import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, CheckCircle2 } from "lucide-react";
import { Episode, Season } from "@/data/mockData";

interface QuickRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEpisode: Episode;
  previousEpisodes: Episode[];
  season: Season;
}

export default function QuickRecapModal({
  isOpen,
  onClose,
  currentEpisode,
  previousEpisodes,
  season,
}: QuickRecapModalProps) {
  const episodesWithSummary = previousEpisodes.filter((ep) => ep.summary);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg"
          >
            <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-display uppercase tracking-wider">
                      Quick Recap
                    </p>
                    <h2 className="font-display font-bold text-base leading-tight">
                      {season.title}
                    </h2>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-display">
                  Você está prestes a ler{" "}
                  <span className="text-foreground font-medium">
                    Ep. {currentEpisode.number} — {currentEpisode.title}
                  </span>
                  . Aqui está o que aconteceu antes:
                </p>
              </div>

              {/* Episodes list */}
              <div className="overflow-y-auto flex-1 min-h-0 px-6 py-4 space-y-5">
                {episodesWithSummary.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum resumo disponível para os episódios anteriores.
                  </p>
                ) : (
                  episodesWithSummary.map((ep, idx) => (
                    <motion.div
                      key={ep.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.15 + idx * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="relative"
                    >
                      {/* Timeline connector */}
                      {idx < episodesWithSummary.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-0 w-[1px] bg-border" />
                      )}

                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[9px] font-display font-bold text-muted-foreground">
                            {ep.number}
                          </span>
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-xs font-display font-semibold text-foreground mb-1">
                            {ep.title}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                            {ep.summary}
                          </p>
                          {ep.keyPoints && ep.keyPoints.length > 0 && (
                            <ul className="space-y-1">
                              {ep.keyPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3 h-3 text-primary/60 flex-shrink-0 mt-0.5" />
                                  <span className="text-[11px] text-muted-foreground leading-snug">
                                    {point}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 pt-4 border-t border-border flex-shrink-0">
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-sm hover:bg-primary/90 transition-colors active:scale-[0.98]"
                >
                  Começar a leitura
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
