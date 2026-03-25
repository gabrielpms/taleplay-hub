import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getStoryById } from "@/data/mockData";
import { coverImages } from "@/data/coverImages";

const brandCurve = [0.22, 1, 0.36, 1] as const;

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days} dia${days > 1 ? "s" : ""}`;
  return new Date(isoDate).toLocaleDateString("pt-BR");
}

export default function Reading() {
  const { readingHistory } = useAuth();
  const navigate = useNavigate();

  const entries = readingHistory
    .map(entry => {
      const story = getStoryById(entry.storyId);
      if (!story) return null;
      const episode = story.seasons.flatMap(s => s.episodes).find(e => e.id === entry.episodeId);
      if (!episode) return null;
      return { ...entry, story, episode };
    })
    .filter(Boolean) as NonNullable<ReturnType<typeof entries[0]>>[];

  // TypeScript workaround for the map above
  type Entry = {
    storyId: string;
    episodeId: string;
    readAt: string;
    story: NonNullable<ReturnType<typeof getStoryById>>;
    episode: NonNullable<NonNullable<ReturnType<typeof getStoryById>>["seasons"][0]["episodes"][0]>;
  };

  const validEntries = readingHistory
    .map((entry): Entry | null => {
      const story = getStoryById(entry.storyId);
      if (!story) return null;
      const episode = story.seasons.flatMap(s => s.episodes).find(e => e.id === entry.episodeId);
      if (!episode) return null;
      return { ...entry, story, episode };
    })
    .filter((e): e is Entry => e !== null);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Histórico de Leitura</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {validEntries.length} {validEntries.length === 1 ? "episódio lido" : "episódios lidos"}
        </p>
      </div>

      {validEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: brandCurve }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-display font-semibold text-lg mb-1">Nenhuma leitura ainda</p>
          <p className="text-muted-foreground text-sm mb-6">
            Os episódios que você ler aparecerão aqui
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-display font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Começar a ler
          </button>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {validEntries.map((entry, i) => (
            <motion.button
              key={`${entry.storyId}-${entry.episodeId}-${entry.readAt}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: brandCurve }}
              onClick={() => navigate(`/read/${entry.storyId}/${entry.episodeId}`)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--card))] border border-border hover:border-border/80 hover:bg-surface-hover transition-all text-left group"
            >
              <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 card-shadow">
                <img
                  src={coverImages[entry.storyId]}
                  alt={entry.story.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm truncate">{entry.story.title}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  Ep. {entry.episode.number} — {entry.episode.title}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">{entry.episode.readTime} de leitura</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-muted-foreground/60">{timeAgo(entry.readAt)}</p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
