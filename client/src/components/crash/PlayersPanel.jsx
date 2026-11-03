import { useState } from 'react';
import { money, multiplier } from '../../config/format';
import { useGame } from '../../store/GameProvider';

export default function PlayersPanel() {
  const { players, online, wagered } = useGame();
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? players : players.slice(0, 8);

  return (
    <aside className="players-panel">
      <header>
        <strong>{players.length}/{online || 0} Players</strong>
        <span>{money(wagered)}</span>
      </header>
      <div className="players-table">
        <div className="players-head">
          <span>Player</span>
          <span>Cashout</span>
          <span>Amount</span>
        </div>
        {rows.map((player) => (
          <div key={player.id} className={`player-row ${player.status}`}>
            <span className="pname">{player.name}</span>
            <span>{player.cashedAt ? multiplier(player.cashedAt) : '—'}</span>
            <span className="pamount">{money(player.amount)}</span>
          </div>
        ))}
      </div>
      {players.length > 8 && (
        <button type="button" className="show-more" onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </aside>
  );
}
