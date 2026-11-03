import { exclusive, highlights, hotGames, originals } from '../config/games';
import CategoryRow from '../components/home/CategoryRow';
import GameSection from '../components/home/GameSection';
import PromoBanners from '../components/home/PromoBanners';

export default function HomePage() {
  return (
    <div className="page">
      <PromoBanners />
      <CategoryRow />
      <GameSection title="BC Originals" games={originals} />
      <GameSection title="Hot Games" games={hotGames} />
      <GameSection title="Highlights" games={highlights} layout="highlight" live />
      <GameSection title="BC Exclusive" games={exclusive} layout="live" />
    </div>
  );
}
