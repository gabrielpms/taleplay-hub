import { HeroCarousel } from "@/components/HeroCarousel";
import { StoryShelf } from "@/components/StoryShelf";
import { StoryRankList } from "@/components/StoryRankList";
import { StoryHighlightShelf } from "@/components/StoryHighlightShelf";
import { trendingStories, newStories, stories } from "@/data/mockData";

const Index = () => {
  return (
    <div className="min-h-screen pt-14">
      <HeroCarousel />
      <div className="py-8">
        <StoryShelf title="Em Alta" stories={trendingStories} />
        <StoryRankList title="Adicionados Recentemente" stories={newStories} />
        <StoryHighlightShelf title="Para Você" stories={stories} />
      </div>
    </div>
  );
};

export default Index;
