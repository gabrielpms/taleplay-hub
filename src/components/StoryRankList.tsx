import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Users, Heart } from "lucide-react";
import type { Story } from "@/data/mockData";
import { coverImages } from "@/data/coverImages";
import { useAuth } from "@/context/AuthContext";

const brandCurve = [0.22, 1, 0.36, 1] as const;

interface StoryRankListProps {
  title: string;
  stories: Story[];
}

export function StoryRankList({ title, stories }: StoryRankListProps) {
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite } = useAuth();

  return (
    <section className="mb-10">
      <h2 className="font-display text-xl font-bold px-8 md:px-16 lg:px-24 mb-4">{title}</h2>
      <div className="px-8 md:px-16 lg:px-24 flex flex-col gap-1">
        {stories.map((story, i) => {
          const favorited = isFavorite(story.id);
          const totalEpisodes = story.seasons.reduce((acc, s) => acc + s.episodes.length, 0);

          return (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: brandCurve }}
              onClick={() => navigate(`/story/${story.id}`)}
              className="flex items-center gap-4 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-surface transition-colors group"
            >
              <span className="font-display font-bold text-2xl text-muted-foreground/30 w-7 text-center flex-shrink-0 select-none tabular-nums">
                {i + 1}
              </span>

              <div className="relative w-14 aspect-[2/3] flex-shrink-0 rounded-md overflow-hidden">
                <img
                  src={coverImages[story.id]}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-sm leading-tight line-clamp-1">
                  {story.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{story.author}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface text-muted-foreground label-caps">
                    {story.genre}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50">
                    {totalEpisodes} ep. · {story.seasons.length} {story.seasons.length === 1 ? "temp." : "temps."}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-primary fill-primary" />
                  <span className="text-xs font-semibold tabular-nums">{story.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground/50">
                  <Users className="w-3 h-3" />
                  <span className="text-[10px] tabular-nums">{(story.readers / 1000).toFixed(1)}k</span>
                </div>
              </div>

              {user && (
                <button
                  onClick={e => { e.stopPropagation(); toggleFavorite(story.id); }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    favorited
                      ? "text-primary opacity-100"
                      : "text-muted-foreground opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? "fill-primary" : ""}`} />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
