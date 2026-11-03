import { Link } from 'react-router-dom';
import { playersLabel } from '../../config/format';
import Icon from '../icons/Icon';
import Art from './Art';

export default function GameCard({ game, layout = 'poster' }) {
  return (
    <Link
      to={game.path}
      className={`gcard ${layout}`}
      style={{ background: `linear-gradient(165deg, ${game.g1}, ${game.g2})` }}
    >
      <span className="gcard-art" aria-hidden="true"><Art name={game.art} /></span>
      <span className="gcard-players">
        <Icon name="user" size={12} />
        {playersLabel(game.players)}
      </span>
      <span className="gcard-copy">
        <strong>{game.title}</strong>
        {game.provider && <small>{game.provider}</small>}
      </span>
    </Link>
  );
}
