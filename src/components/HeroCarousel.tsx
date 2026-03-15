import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { featuredStories } from "@/data/mockData";
import { coverImages } from "@/data/coverImages";
import heroBg from "@/assets/hero-bg.jpg";

const brandCurve = [0.22, 1, 0.36, 1] as const;

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const story = featuredStories[current];
  const navigate = useNavigate();

  const next = () => setCurrent((c) => (c + 1) % featuredStories.length);
  const prev = () => setCurrent((c) => (c - 1 + featuredStories.length) % featuredStories.length);

  return (
    <section className="relative w-full aspect-[16/7] min-h-[480px] max-h-[700px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        {/* Ambient color from current story */}
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{ background: `radial-gradient(ellipse at 70% 50%, hsl(${story.dominantColor} / 0.15), transparent 70%)` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-8 md:px-16 lg:px-24">
        <div className="flex items-center gap-12 w-full max-w-7xl mx-auto">
          {/* Text */}
          <motion.div
            key={story.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: brandCurve }}
            className="flex-1 max-w-xl"
          >
            <span className="label-caps text-primary mb-3 block">{story.genre}</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {story.title}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-4 line-clamp-3 font-body">
              {story.synopsis}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-primary fill-primary" /> {story.rating}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {story.readTime}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {(story.readers / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/story/${story.id}`)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-medium text-sm hover:bg-primary/90 transition-colors active:scale-[0.98]"
              >
                Começar a Ler
              </button>
              <button
                onClick={() => navigate(`/story/${story.id}`)}
                className="px-6 py-3 bg-surface border border-border rounded-lg font-display font-medium text-sm text-foreground hover:bg-surface-hover transition-colors active:scale-[0.98]"
              >
                Detalhes
              </button>
            </div>
          </motion.div>

          {/* Cover */}
          <motion.div
            key={`cover-${story.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: brandCurve }}
            className="hidden md:block flex-shrink-0"
          >
            <div
              className="w-48 lg:w-56 aspect-[2/3] rounded-xl overflow-hidden card-shadow inner-glow cursor-pointer"
              onClick={() => navigate(`/story/${story.id}`)}
            >
              <img
                src={coverImages[story.id]}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-8 right-8 md:right-16 lg:right-24 flex gap-2 z-20">
        <button onClick={prev} className="w-10 h-10 rounded-full bg-surface/80 border border-border flex items-center justify-center hover:bg-surface-hover transition-colors active:scale-95">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next} className="w-10 h-10 rounded-full bg-surface/80 border border-border flex items-center justify-center hover:bg-surface-hover transition-colors active:scale-95">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {featuredStories.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-primary" : "w-4 bg-muted-foreground/30"}`}
          />
        ))}
      </div>
    </section>
  );
}
