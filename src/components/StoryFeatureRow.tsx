import { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Heart } from "lucide-react";
import type { Story } from "@/data/mockData";
import { coverImages } from "@/data/coverImages";
import { useAuth } from "@/context/AuthContext";

const brandCurve = [0.22, 1, 0.36, 1] as const;

interface StoryFeatureRowProps {
  title: string;
  stories: Story[];
}

export function StoryFeatureRow({ title, stories }: StoryFeatureRowProps) {
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

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
          {stories.map((story, i) => {
            const favorited = isFavorite(story.id);
            const cover = coverImages[story.id];

            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: brandCurve }}
                whileHover={{ scale: 1.03, transition: { duration: 0.25, ease: brandCurve } }}
                onClick={() => navigate(`/story/${story.id}`)}
                className="relative flex-shrink-0 w-[268px] h-[150px] md:w-[340px] md:h-[190px] rounded-2xl overflow-hidden cursor-pointer group"
              >
                {/* Cinematic blurred background */}
                <img
                  src={cover}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-[0.35]"
                />

                {/* Left-to-right gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/5" />

                {/* Sharp portrait cover on the right */}
                <img
                  src={cover}
                  alt={story.title}
                  className="absolute right-0 top-0 h-full w-auto object-cover"
                />

                {/* Fade cover into background */}
                <div className="absolute right-0 top-0 h-full w-[55%] bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

                {/* Text content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 w-[64%]">
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-primary mb-1.5">
                    {story.genre}
                  </span>
                  <h3 className="font-display font-bold text-[15px] md:text-lg leading-snug text-white line-clamp-1">
                    {story.title}
                  </h3>
                  <p className="text-[11px] text-white/55 mt-0.5 line-clamp-1">{story.author}</p>
                  <p className="text-[11px] text-white/45 mt-2 line-clamp-2 leading-relaxed hidden md:block">
                    {story.synopsis}
                  </p>
                </div>

                {/* Favorite */}
                {user && (
                  <button
                    onClick={e => { e.stopPropagation(); toggleFavorite(story.id); }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 ${
                      favorited
                        ? "bg-white/20 opacity-100"
                        : "bg-black/40 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorited ? "text-primary fill-primary" : "text-white"}`} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="absolute top-0 right-0 w-20 h-full gradient-fade-right pointer-events-none" />
      </div>
    </section>
  );
}
