import { Link, useLocation, useParams } from 'react-router-dom';
import { extraPages } from '../config/navigation';
import { findGame } from '../config/games';

export default function SimplePage() {
  const { pathname } = useLocation();
  const { slug } = useParams();
  const game = slug ? findGame(slug) : null;
  const page = extraPages.find((item) => item.path === pathname);
  const title = game?.title || page?.title || 'Not found';
  const text = game
    ? 'This table is a preview. Crash is the playable original in this demo.'
    : (page?.text || 'That page is not part of this demo.');

  return (
    <div className="page">
      <section className="simple-card">
        <h1>{title}</h1>
        <p>{text}</p>
        <Link to={game ? '/crash' : '/'} className="btn btn-primary">{game ? 'Play Crash' : 'Back to Casino'}</Link>
      </section>
    </div>
  );
}
