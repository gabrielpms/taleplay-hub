import { HeroCarousel } from "@/components/HeroCarousel";
import { StoryShelf } from "@/components/StoryShelf";
import { trendingStories, newStories, stories } from "@/data/mockData";

const Index = () => {
  return (
    <div className="min-h-screen pt-14">
      <HeroCarousel />
      <div className="py-8">
        <StoryShelf title="Em Alta" stories={trendingStories} />
        <StoryShelf title="Adicionados Recentemente" stories={newStories} />
        <StoryShelf title="Para Você" stories={stories} />
      </div>
    </div>
  );
};

export default Index;
