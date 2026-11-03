import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allGames } from '../../config/games';
import { useUi } from '../../store/UiProvider';
import Modal from '../common/Modal';

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useUi();
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const unique = [];
    const seen = new Set();
    allGames.forEach((game) => {
      if (seen.has(game.id)) return;
      seen.add(game.id);
      if (!needle || game.title.toLowerCase().includes(needle)) unique.push(game);
    });
    return unique.slice(0, 12);
  }, [query]);

  return (
    <Modal open={searchOpen} title="Search" onClose={() => setSearchOpen(false)}>
      <input className="search-input" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games" />
      <div className="search-list">
        {results.map((game) => (
          <Link key={game.id} to={game.path} onClick={() => setSearchOpen(false)} className="search-item">
            <span>{game.title}</span>
            <small>{game.provider || 'BC'}</small>
          </Link>
        ))}
        {!results.length && <p className="demo-note">No games match that search.</p>}
      </div>
    </Modal>
  );
}
