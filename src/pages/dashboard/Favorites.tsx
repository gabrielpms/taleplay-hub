import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { stories } from "@/data/mockData";
import { coverImages } from "@/data/coverImages";

const brandCurve = [0.22, 1, 0.36, 1] as const;

export default function Favorites() {
  const { favorites, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  const favoriteStories = stories.filter(s => favorites.includes(s.id));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Favoritos</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {favoriteStories.length} {favoriteStories.length === 1 ? "história favoritada" : "histórias favoritadas"}
        </p>
      </div>

      {favoriteStories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: brandCurve }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-display font-semibold text-lg mb-1">Nenhum favorito ainda</p>
          <p className="text-muted-foreground text-sm mb-6">
            Favorite histórias na vitrine para encontrá-las aqui
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-display font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Explorar histórias
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favoriteStories.map((story, i) => {
            const totalEp = story.seasons.reduce((acc, s) => acc + s.episodes.length, 0);
            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: brandCurve }}
                className="group cursor-pointer"
                onClick={() => navigate(`/story/${story.id}`)}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 card-shadow">
                  <img
                    src={coverImages[story.id]}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={e => { e.stopPropagation(); toggleFavorite(story.id); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/70 backdrop-blur flex items-center justify-center transition-all"
                  >
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                  </button>
                </div>
                <h3 className="font-display font-semibold text-sm leading-tight line-clamp-1">
                  {story.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{story.author}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {story.seasons.length} {story.seasons.length === 1 ? "temporada" : "temporadas"} · {totalEp} ep.
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
