import { Link } from 'react-router-dom';

const banners = [
  {
    id: 'house',
    to: '/crash',
    eyebrow: 'In-house',
    title: 'Dive into our in-house games, live casino and slots',
    className: 'banner-house',
  },
  {
    id: 'sports',
    to: '/sports',
    eyebrow: 'Sportsbook',
    title: 'Bet on Football, Cricket, NFL, eSports & over 80 sports!',
    className: 'banner-sports',
  },
];

export default function PromoBanners() {
  return (
    <div className="promos">
      {banners.map((banner) => (
        <Link key={banner.id} to={banner.to} className={`promo-banner ${banner.className}`}>
          <div>
            <small>{banner.eyebrow}</small>
            <strong>{banner.title}</strong>
          </div>
          <span className="banner-art" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
