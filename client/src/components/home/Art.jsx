export default function Art({ name }) {
  if (name === 'crash') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <path d="M14 88c28-6 42-22 62-38 18-14 34-20 70-24" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="132" cy="24" r="7" fill="#ffe08a" />
        <ellipse cx="48" cy="78" rx="18" ry="12" fill="#ffd15c" />
        <ellipse cx="78" cy="62" rx="12" ry="9" fill="#fff59a" />
      </svg>
    );
  }
  if (name === 'mines') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <circle cx="80" cy="58" r="26" fill="#2a2a2a" />
        <circle cx="80" cy="58" r="16" fill="#ff5a7a" />
        <path d="M80 18v16M80 84v14M40 58H24M136 58h-16M48 28l12 12M112 88l12 12M112 28l-12 12M48 88l12-12" stroke="#ffd0dc" strokeWidth="4" />
      </svg>
    );
  }
  if (name === 'dice') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <rect x="34" y="28" width="46" height="46" rx="8" fill="#fff" />
        <rect x="78" y="42" width="46" height="46" rx="8" fill="#d9ffe8" />
        <circle cx="50" cy="44" r="4" /><circle cx="64" cy="58" r="4" /><circle cx="94" cy="58" r="4" /><circle cx="108" cy="72" r="4" />
      </svg>
    );
  }
  if (name === 'wheel') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <circle cx="80" cy="58" r="34" fill="#38bdf8" />
        <path d="M80 24 L92 58 L80 58 Z" fill="#facc15" />
        <path d="M80 92 L68 58 L80 58 Z" fill="#22c55e" />
        <circle cx="80" cy="58" r="8" fill="#fff" />
      </svg>
    );
  }
  if (name === 'rocket') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <path d="M86 18c18 10 22 32 16 52l-18 8-8-18c8-20 6-36 10-42z" fill="#fff" />
        <path d="M70 62l-16 18 20-6z" fill="#fb7185" />
        <circle cx="90" cy="40" r="5" fill="#38bdf8" />
      </svg>
    );
  }
  if (name === 'plinko') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        {[0, 1, 2, 3, 4].map((row) => (
          Array.from({ length: row + 3 }, (_, col) => (
            <circle key={`${row}-${col}`} cx={80 - row * 10 + col * 20} cy={24 + row * 16} r="3.5" fill="#bbf7d0" />
          ))
        ))}
      </svg>
    );
  }
  if (name === 'tower') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <rect x="58" y="24" width="44" height="16" rx="3" fill="#fde68a" />
        <rect x="50" y="44" width="60" height="16" rx="3" fill="#86efac" />
        <rect x="42" y="64" width="76" height="16" rx="3" fill="#4ade80" />
      </svg>
    );
  }
  if (name === 'coin') {
    return (
      <svg className="art" viewBox="0 0 160 110" aria-hidden="true">
        <ellipse cx="80" cy="60" rx="36" ry="28" fill="#f5c542" />
        <ellipse cx="80" cy="54" rx="36" ry="28" fill="#ffe083" />
        <text x="80" y="62" textAnchor="middle" fontSize="22" fontWeight="700" fill="#a16207">$</text>
      </svg>
    );
  }
  if (name === 'pumpkin') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <ellipse cx="80" cy="64" rx="34" ry="26" fill="#f97316" />
        <path d="M70 52h6l4 8 4-8h6" stroke="#111" strokeWidth="3" fill="none" />
        <path d="M80 40c6-10 8-8 4 2" stroke="#166534" strokeWidth="4" fill="none" />
      </svg>
    );
  }
  if (name === 'cat') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <circle cx="78" cy="62" r="24" fill="#fdba74" />
        <path d="M58 48l8-18 10 14M98 48l-8-18-10 14" fill="#fb923c" />
        <circle cx="70" cy="60" r="3" /><circle cx="88" cy="60" r="3" />
        <circle cx="108" cy="40" r="14" fill="#fff" />
      </svg>
    );
  }
  if (name === 'party') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <rect x="48" y="28" width="64" height="54" rx="12" fill="#052e16" />
        <circle cx="80" cy="52" r="12" fill="#4ade80" />
        <path d="M68 74h24" stroke="#86efac" strokeWidth="4" />
      </svg>
    );
  }
  if (name === 'anubis') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <path d="M80 22l18 10v18c0 18-18 28-18 28S62 68 62 50V32z" fill="#f5d38a" />
        <path d="M62 40l-16 8 16 6M98 40l16 8-16 6" fill="#1f2937" />
      </svg>
    );
  }
  if (name === 'book') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <path d="M40 30h36c8 8 8 42 0 52H40z" fill="#fbbf24" />
        <path d="M120 30H84c-8 8-8 42 0 52h36z" fill="#f59e0b" />
      </svg>
    );
  }
  if (name === 'candy') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <circle cx="80" cy="58" r="22" fill="#fb7185" />
        <circle cx="80" cy="58" r="10" fill="#fff" />
        <rect x="28" y="50" width="22" height="12" rx="4" fill="#fff" transform="rotate(-30 39 56)" />
      </svg>
    );
  }
  if (name === 'giza') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <path d="M30 86h100L80 28z" fill="#fbbf24" />
        <path d="M80 28l20 58H80z" fill="#d97706" />
      </svg>
    );
  }
  if (name === 'gem') {
    return (
      <svg className="art" viewBox="0 0 160 110">
        <path d="M80 22l28 18-28 48L52 40z" fill="#67e8f9" />
        <path d="M80 22l28 18H52z" fill="#cffafe" />
      </svg>
    );
  }
  return null;
}
