import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StoryCard } from "./StoryCard";
import type { Story } from "@/data/mockData";

interface StoryShelfProps {
  title: string;
  stories: Story[];
}

export function StoryShelf({ title, stories }: StoryShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
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
          className="flex gap-5 overflow-x-auto hide-scrollbar px-8 md:px-16 lg:px-24 snap-x snap-mandatory pb-2"
        >
          {stories.map((story, i) => (
            <div key={story.id} className="snap-start">
              <StoryCard story={story} index={i} />
            </div>
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute top-0 right-0 w-16 h-full gradient-fade-right pointer-events-none" />
      </div>
    </section>
  );
}
