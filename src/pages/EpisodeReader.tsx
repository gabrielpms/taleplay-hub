import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, X } from "lucide-react";
import { getStoryById } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { parseTextWithCharacters } from "@/components/CharacterMention";
import QuickRecapModal from "@/components/QuickRecapModal";

export default function EpisodeReader() {
  const { storyId, episodeId } = useParams<{ storyId: string; episodeId: string }>();
  const navigate = useNavigate();
  const { addToHistory } = useAuth();
  const [showUI, setShowUI] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const story = getStoryById(storyId || "");
  const currentSeason = story?.seasons.find((s) =>
    s.episodes.some((e) => e.id === episodeId)
  );
  const episode = currentSeason?.episodes.find((e) => e.id === episodeId);

  // Find previous episodes in this season
  const episodeIndex = currentSeason?.episodes.findIndex((e) => e.id === episodeId) ?? -1;
  const previousEpisodes = currentSeason?.episodes.slice(0, episodeIndex) ?? [];

  const [showRecap, setShowRecap] = useState(false);

  const handleCloseRecap = () => setShowRecap(false);

  // Track which characters have been introduced in this reading session
  // Using a ref so mutations don't trigger re-renders mid-paragraph
  const shownCharactersRef = useRef<Set<string>>(new Set());

  // Parse paragraphs with character highlighting
  const paragraphs = useMemo(() => {
    if (!episode) return [];
    return episode.content.split("\n\n").filter(Boolean);
  }, [episode]);

  const characters = story?.characters ?? [];

  const parsedParagraphs = useMemo(() => {
    // Reset seen characters for each episode
    shownCharactersRef.current = new Set();
    return paragraphs.map((p) =>
      parseTextWithCharacters(p, characters, shownCharactersRef.current)
    );
  }, [paragraphs, characters]);

  useEffect(() => {
    if (storyId && episodeId) addToHistory(storyId, episodeId);
  }, [storyId, episodeId]);

  // Ghost UI: hide after 3 seconds of no activity
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setShowUI(true);
      clearTimeout(timeout);

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);

      timeout = setTimeout(() => setShowUI(false), 3000);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, []);

  if (!story || !currentSeason || !episode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Episódio não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" onMouseMove={() => setShowUI(true)}>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-border/30">
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Ghost UI Header */}
      <AnimatePresence>
        {showUI && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between h-12 px-6 md:px-12">
              <button
                onClick={() => navigate(`/story/${storyId}`)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-display">{story.title}</span>
              </button>
              <div className="text-center">
                <p className="text-xs font-display font-medium">{episode.title}</p>
                <p className="text-[10px] text-muted-foreground">Ep. {episode.number}</p>
              </div>
              <button
                onClick={() => navigate(`/story/${storyId}`)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Content */}
      <article className="max-w-2xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{episode.title}</h1>
          <p className="text-sm text-muted-foreground font-display mb-10">
            Episódio {episode.number} • {episode.readTime} de leitura
          </p>

          <div className="space-y-6">
            {parsedParagraphs.map((nodes, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="text-reading text-foreground/90"
              >
                {nodes}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* End of episode */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground font-display text-sm mb-4">Fim do episódio</p>
          <button
            onClick={() => navigate(`/story/${storyId}`)}
            className="px-6 py-3 bg-surface border border-border rounded-lg font-display font-medium text-sm hover:bg-surface-hover transition-colors active:scale-[0.98]"
          >
            Voltar para a história
          </button>
        </div>
      </article>

      {/* Floating Recap Button */}
      {episodeIndex > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setShowRecap(true)}
          className="fixed top-1/2 -translate-y-1/2 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-full shadow-lg text-sm font-display font-medium text-foreground hover:bg-surface-hover hover:border-primary/40 transition-colors active:scale-[0.97]"
          title="Ver recap dos episódios anteriores"
        >
          <BookOpen className="w-4 h-4 text-primary" />
          Recap
        </motion.button>
      )}

      {/* Quick Recap Modal */}
      {currentSeason && episodeIndex > 0 && (
        <QuickRecapModal
          isOpen={showRecap}
          onClose={handleCloseRecap}
          currentEpisode={episode}
          previousEpisodes={previousEpisodes}
          season={currentSeason}
        />
      )}
    </div>
  );
}
