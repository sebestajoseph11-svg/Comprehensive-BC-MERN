import { originals, hotGames, exclusive } from '../config/games';
import GameSection from '../components/home/GameSection';

export default function ExplorePage() {
  return (
    <div className="page">
      <h1 className="page-title">Explore</h1>
      <GameSection title="BC Originals" games={originals} />
      <GameSection title="Hot Games" games={hotGames} />
      <GameSection title="BC Exclusive" games={exclusive} layout="live" />
    </div>
  );
}
