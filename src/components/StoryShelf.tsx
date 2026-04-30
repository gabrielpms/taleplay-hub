import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { StoryCard } from "./StoryCard";
import type { Story } from "@/data/mockData";

interface StoryShelfProps {
  title: string;
  stories: Story[];
}

export function StoryShelf({ title, stories }: StoryShelfProps) {
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
