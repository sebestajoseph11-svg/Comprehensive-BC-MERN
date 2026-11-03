import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="brand" aria-label="BC.GAME home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="28" height="28">
          <rect width="32" height="32" rx="9" fill="#323738" />
          <path d="M8 20c1-7 4-10 8-10 2-4 7-4 8 0 2 1 2 4 .5 6H20l-.6 4H8z" fill="#ff9f1a" />
          <circle cx="22" cy="10" r="3" fill="#24ee89" />
        </svg>
      </span>
      <span className="brand-name">BC.GAME</span>
    </Link>
  );
}
