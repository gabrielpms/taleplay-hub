import { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import type { Story } from "@/data/mockData";
import { coverImages } from "@/data/coverImages";
import { useAuth } from "@/context/AuthContext";

const brandCurve = [0.22, 1, 0.36, 1] as const;

interface StoryHighlightShelfProps {
  title: string;
  stories: Story[];
}

export function StoryHighlightShelf({ title, stories }: StoryHighlightShelfProps) {
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between px-8 md:px-16 lg:px-24 mb-4">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <div className="flex gap-1">
          <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-8 md:px-16 lg:px-24 snap-x snap-mandatory pb-2"
        >
          {stories.map((story, i) => {
            const favorited = isFavorite(story.id);
            const totalEpisodes = story.seasons.reduce((acc, s) => acc + s.episodes.length, 0);

            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: brandCurve }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                onClick={() => navigate(`/story/${story.id}`)}
                className="snap-start flex-shrink-0 w-[272px] md:w-[312px] flex gap-3 p-3 rounded-xl bg-surface border border-white/5 cursor-pointer group hover:border-white/10 transition-colors"
              >
                <div className="relative w-[72px] flex-shrink-0 rounded-md overflow-hidden self-stretch">
                  <img
                    src={coverImages[story.id]}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {user && (
                    <button
                      onClick={e => { e.stopPropagation(); toggleFavorite(story.id); }}
                      className={`absolute top-1 right-1 w-6 h-6 rounded-full backdrop-blur flex items-center justify-center transition-all duration-200 ${
                        favorited ? "bg-background/70 opacity-100" : "bg-background/50 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${favorited ? "text-primary fill-primary" : "text-white"}`} />
                    </button>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-background text-muted-foreground label-caps">
                        {story.genre}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-primary fill-primary" />
                        <span className="text-[10px] font-semibold">{story.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-display font-semibold text-sm leading-tight line-clamp-1">
                      {story.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{story.author}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2 line-clamp-3 leading-relaxed">
                      {story.synopsis}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground/40 mt-2">
                    {story.seasons.length} {story.seasons.length === 1 ? "temporada" : "temporadas"} · {totalEpisodes} ep. · {story.readTime}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="absolute top-0 right-0 w-16 h-full gradient-fade-right pointer-events-none" />
      </div>
    </section>
  );
}
