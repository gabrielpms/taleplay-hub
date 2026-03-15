import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Users, BookmarkPlus, Share2, Play } from "lucide-react";
import { getStoryById } from "@/data/mockData";
import { coverImages } from "@/data/coverImages";

const brandCurve = [0.22, 1, 0.36, 1] as const;

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const story = getStoryById(id || "");

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">História não encontrada</p>
      </div>
    );
  }

  const totalEpisodes = story.seasons.reduce((acc, s) => acc + s.episodes.length, 0);

  return (
    <div className="min-h-screen pt-14">
      {/* Hero section */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={coverImages[story.id]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        {/* Ambient mood */}
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{ background: `radial-gradient(ellipse at 50% 30%, hsl(${story.dominantColor} / 0.2), transparent 70%)` }}
        />

        <div className="relative z-10 h-full flex items-end px-8 md:px-16 lg:px-24 pb-12">
          <div className="flex gap-8 items-end max-w-7xl mx-auto w-full">
            {/* Cover */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: brandCurve }}
              className="hidden md:block flex-shrink-0"
            >
              <div className="w-44 lg:w-52 aspect-[2/3] rounded-xl overflow-hidden card-shadow inner-glow">
                <img src={coverImages[story.id]} alt={story.title} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: brandCurve }}
              className="flex-1 pb-2"
            >
              <span className="label-caps text-primary mb-2 block">{story.genre}</span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2">{story.title}</h1>
              <p className="text-muted-foreground text-sm font-display mb-3">por {story.author}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-primary fill-primary" /> {story.rating}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {story.readTime}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {(story.readers / 1000).toFixed(1)}k leitores</span>
                <span>{story.seasons.length} temp. • {totalEpisodes} ep.</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/read/${story.id}/${story.seasons[0].episodes[0].id}`)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-medium text-sm hover:bg-primary/90 transition-colors active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-current" /> Começar a Ler
                </button>
                <button className="flex items-center gap-2 px-5 py-3 bg-surface border border-border rounded-lg font-display font-medium text-sm text-foreground hover:bg-surface-hover transition-colors active:scale-[0.98]">
                  <BookmarkPlus className="w-4 h-4" /> Minha Estante
                </button>
                <button className="w-11 h-11 rounded-lg bg-surface border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors active:scale-95">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Synopsis + Seasons */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Synopsis */}
          <div className="lg:col-span-1">
            <h2 className="font-display font-bold text-lg mb-3">Sinopse</h2>
            <p className="font-body text-muted-foreground text-base leading-relaxed">{story.synopsis}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {story.tags.map(tag => (
                <span key={tag} className="label-caps px-3 py-1 rounded-full bg-surface border border-border text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Seasons & Episodes */}
          <div className="lg:col-span-2">
            {story.seasons.map((season, si) => (
              <motion.div
                key={season.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: si * 0.1, ease: brandCurve }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-display font-bold text-base">Temporada {season.number}</h3>
                  <span className="text-muted-foreground text-sm">— {season.title}</span>
                </div>
                <div className="space-y-2">
                  {season.episodes.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => navigate(`/read/${story.id}/${ep.id}`)}
                      disabled={ep.status === "draft"}
                      className="w-full flex items-center gap-4 p-4 rounded-lg bg-surface hover:bg-surface-hover border border-border/50 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed group text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <span className="text-xs font-display font-bold">{ep.number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-medium text-sm truncate">{ep.title}</p>
                        <p className="text-xs text-muted-foreground">{ep.readTime} de leitura</p>
                      </div>
                      {ep.status === "draft" && (
                        <span className="label-caps text-[10px] px-2 py-0.5 rounded bg-accent text-muted-foreground">Rascunho</span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-8 md:left-16 z-30 w-10 h-10 rounded-full bg-surface/80 backdrop-blur border border-border flex items-center justify-center hover:bg-surface-hover transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  );
}
