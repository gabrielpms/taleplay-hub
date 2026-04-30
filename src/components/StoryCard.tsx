import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Story } from "@/data/mockData";
import { coverImages } from "@/data/coverImages";
import { useAuth } from "@/context/AuthContext";

const brandCurve = [0.22, 1, 0.36, 1] as const;

interface StoryCardProps {
  story: Story;
  index?: number;
}

export function StoryCard({ story, index = 0 }: StoryCardProps) {
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite } = useAuth();
  const favorited = isFavorite(story.id);
  const totalEpisodes = story.seasons.reduce((acc, s) => acc + s.episodes.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: brandCurve }}
      whileHover={{ scale: 1.05, transition: { duration: 0.25, ease: brandCurve } }}
      className="flex-shrink-0 w-[160px] md:w-[188px] cursor-pointer group"
      onClick={() => navigate(`/story/${story.id}`)}
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 card-shadow group-hover:card-shadow-hover transition-shadow duration-300">
        <img
          src={coverImages[story.id]}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 gradient-fade-bottom opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {user && (
          <button
            onClick={e => { e.stopPropagation(); toggleFavorite(story.id); }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-all duration-200 ${
              favorited
                ? "bg-background/70 opacity-100"
                : "bg-background/50 opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${favorited ? "text-primary fill-primary" : "text-white"}`}
            />
          </button>
        )}
      </div>
      <h3 className="font-display font-semibold text-sm leading-tight line-clamp-1 text-foreground">
        {story.title}
      </h3>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{story.author}</p>
      <p className="text-xs text-muted-foreground/70 mt-0.5">
        {story.seasons.length} {story.seasons.length === 1 ? "temporada" : "temporadas"} · {totalEpisodes} ep.
      </p>
    </motion.div>
  );
}
