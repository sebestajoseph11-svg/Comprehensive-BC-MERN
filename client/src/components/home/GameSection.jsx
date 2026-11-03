import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../icons/Icon';
import GameCard from './GameCard';

export default function GameSection({ title, games, layout = 'poster', to = '/explore', live = false }) {
  const scroller = useRef(null);
  const scroll = (direction) => {
    scroller.current?.scrollBy({ left: direction * 420, behavior: 'smooth' });
  };

  return (
    <section className="gsection">
      <div className="section-head">
        <h2>{live && <i className="live-dot" />}{title}</h2>
        <div className="section-tools">
          <Link to={to}>All</Link>
          <button type="button" aria-label="Previous" onClick={() => scroll(-1)}><Icon name="chevron" size={16} /></button>
          <button type="button" className="next" aria-label="Next" onClick={() => scroll(1)}><Icon name="chevron" size={16} /></button>
        </div>
      </div>
      <div className={`grow layout-${layout}`} ref={scroller}>
        {games.map((game) => <GameCard key={game.id} game={game} layout={layout} />)}
      </div>
    </section>
  );
}
