import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Story } from "@/data/mockData";

const brandCurve = [0.22, 1, 0.36, 1] as const;

interface AuthorShelfProps {
  title: string;
  stories: Story[];
}

export function AuthorShelf({ title, stories }: AuthorShelfProps) {
  const navigate = useNavigate();

  const authors = [...new Map(stories.map(s => [s.author, s])).values()].map(anchor => ({
    name: anchor.author,
    dominantColor: anchor.dominantColor,
    storyCount: stories.filter(s => s.author === anchor.author).length,
    totalReaders: stories
      .filter(s => s.author === anchor.author)
      .reduce((acc, s) => acc + s.readers, 0),
    firstStoryId: anchor.id,
    initials: anchor.author.split(" ").map(n => n[0]).slice(0, 2).join(""),
  }));

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between px-8 md:px-16 lg:px-24 mb-5">
        <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
        <button className="flex items-center gap-0.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          Ver tudo <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-5 overflow-x-auto hide-scrollbar px-8 md:px-16 lg:px-24 pb-2">
        {authors.map((author, i) => (
          <motion.div
            key={author.name}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: brandCurve }}
            whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
            onClick={() => navigate(`/story/${author.firstStoryId}`)}
            className="flex-shrink-0 flex flex-col items-center gap-2.5 cursor-pointer group w-[96px]"
          >
            {/* Avatar */}
            <div
              className="relative w-16 h-16 md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-primary/40 transition-all duration-300"
              style={{ background: `hsl(${author.dominantColor})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
              <span className="font-display font-bold text-lg text-white relative z-10 select-none">
                {author.initials}
              </span>
            </div>

            {/* Name + stats */}
            <div className="text-center">
              <p className="font-display font-semibold text-[13px] leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-200">
                {author.name.split(" ")[0]}
              </p>
              <p className="text-[11px] text-muted-foreground/55 mt-0.5">
                {author.storyCount} {author.storyCount === 1 ? "história" : "histórias"}
              </p>
              <p className="text-[10px] text-muted-foreground/40 mt-0.5">
                {(author.totalReaders / 1000).toFixed(1)}k leitores
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
