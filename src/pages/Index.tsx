import { HeroCarousel } from "@/components/HeroCarousel";
import { StoryFeatureRow } from "@/components/StoryFeatureRow";
import { EpisodeRow } from "@/components/EpisodeRow";
import { AuthorShelf } from "@/components/AuthorShelf";
import { StoryShelf } from "@/components/StoryShelf";
import { trendingStories, newStories, stories } from "@/data/mockData";

const Index = () => {
  return (
    <div className="min-h-screen pt-14">
      <HeroCarousel />
      <div className="py-8">
        <StoryFeatureRow title="Em Alta" stories={trendingStories} />
        <EpisodeRow title="Episódios em Destaque" stories={stories} />
        <AuthorShelf title="Autores em Destaque" stories={stories} />
        <StoryShelf title="Adicionados Recentemente" stories={newStories} />
      </div>
    </div>
  );
};

export default Index;
