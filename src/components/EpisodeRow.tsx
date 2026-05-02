import { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";
import type { Story } from "@/data/mockData";
import { coverImages } from "@/data/coverImages";

const brandCurve = [0.22, 1, 0.36, 1] as const;

interface EpisodeRowProps {
  title: string;
  stories: Story[];
}

export function EpisodeRow({ title, stories }: EpisodeRowProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = stories.flatMap(story =>
    story.seasons.flatMap(season =>
      season.episodes
        .filter(ep => ep.status === "published")
        .map(ep => ({ ep, season, story }))
    )
  );

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between px-8 md:px-16 lg:px-24 mb-5">
        <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
        <button className="flex items-center gap-0.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          Ver tudo <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-8 md:px-16 lg:px-24 pb-2"
        >
          {items.map(({ ep, season, story }, i) => {
            const cover = coverImages[story.id];

            return (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: brandCurve }}
                className="flex-shrink-0 w-[224px] md:w-[260px] cursor-pointer group"
                onClick={() => navigate(`/read/${story.id}/${ep.id}`)}
              >
                {/* Thumbnail */}
                <motion.div
                  whileHover={{ scale: 1.04, transition: { duration: 0.25, ease: brandCurve } }}
                  className="relative w-full aspect-video rounded-xl overflow-hidden mb-3"
                >
                  <img
                    src={cover}
                    alt={ep.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Season/Episode badge */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold tracking-wide bg-black/55 backdrop-blur-sm text-white/90 px-2 py-1 rounded-md">
                      T{season.number} · E{ep.number}
                    </span>
                  </div>

                  {/* Episode title at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-display font-semibold text-[13px] leading-snug line-clamp-2">
                      {ep.title}
                    </p>
                  </div>
                </motion.div>

                {/* Below card: series name + read time */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground line-clamp-1 leading-tight">
                    {story.title}
                  </p>
                  <div className="flex items-center gap-1 text-muted-foreground/50 flex-shrink-0 pt-0.5">
                    <Clock className="w-3 h-3" />
                    <span className="text-[11px]">{ep.readTime}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground/55 mt-0.5">{story.author}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="absolute top-0 right-0 w-20 h-full gradient-fade-right pointer-events-none" />
      </div>
    </section>
  );
}
