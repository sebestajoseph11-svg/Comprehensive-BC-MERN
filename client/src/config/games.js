export const categories = [
  { id: 'poker', label: 'POKER', icon: 'poker', path: '/game/poker' },
  { id: 'racing', label: 'RACING', icon: 'horse', path: '/game/racing' },
  { id: 'lottery', label: 'LOTTERY', icon: 'ticket', path: '/lottery' },
  { id: 'updown', label: 'UPDOWN', icon: 'updown', path: '/game/updown' },
  { id: 'bingo', label: 'BINGO', icon: 'bingo', path: '/game/bingo' },
];

export const originals = [
  { id: 'crash', title: 'CRASH', provider: 'ORIGINAL GAME', players: 1977, path: '/crash', art: 'crash', g1: '#7c4dff', g2: '#2a1160' },
  { id: 'mines', title: 'MINES', provider: 'ORIGINAL GAME', players: 172, path: '/game/mines', art: 'mines', g1: '#9b5cff', g2: '#3a1468' },
  { id: 'cat', title: 'ANGRY MEEOW', provider: 'ORIGINAL GAME', players: 97, path: '/game/angry-meeow', art: 'cat', g1: '#ff7a3c', g2: '#7a2d12' },
  { id: 'dice', title: 'CLASSIC DICE', provider: 'ORIGINAL GAME', players: 96, path: '/game/dice', art: 'dice', g1: '#1f9d55', g2: '#0d4a2b' },
  { id: 'wheel', title: 'WHEEL', provider: 'ORIGINAL GAME', players: 38, path: '/game/wheel', art: 'wheel', g1: '#1d4ed8', g2: '#0b1b4a' },
  { id: 'limbo', title: 'LIMBO', provider: 'ORIGINAL GAME', players: 122, path: '/game/limbo', art: 'rocket', g1: '#14b86a', g2: '#064e32' },
  { id: 'plinko', title: 'PLINKO', provider: 'ORIGINAL GAME', players: 86, path: '/game/plinko', art: 'plinko', g1: '#0f9f6e', g2: '#064e3b' },
  { id: 'tower', title: 'TOWER LEGEND', provider: 'ORIGINAL GAME', players: 64, path: '/game/tower', art: 'tower', g1: '#16a34a', g2: '#14532d' },
];

export const hotGames = [
  { id: 'coins', title: '100 GOLDEN COINS', provider: 'AMUSNET', players: 19, path: '/game/golden-coins', art: 'coin', g1: '#6d28d9', g2: '#3b0764' },
  { id: 'pumpkin', title: "POT O' PUMPKIN", provider: 'AMUSNET', players: 45, path: '/game/pumpkin', art: 'pumpkin', g1: '#7c3aed', g2: '#4c1d95' },
  { id: 'party', title: 'Party Mode', provider: 'CROCO', players: 78, path: '/game/party', art: 'party', g1: '#059669', g2: '#064e3b' },
  { id: 'anubis', title: 'ANUBIS WRATH', provider: 'PG', players: 71, path: '/game/anubis', art: 'anubis', g1: '#b45309', g2: '#451a03' },
  { id: 'book', title: 'BOOK OF GOLD', provider: '1spin4win', players: 47, path: '/game/book', art: 'book', g1: '#a16207', g2: '#422006' },
  { id: 'candy', title: 'SWEET BONANZA', provider: 'PRAGMATIC', players: 86, path: '/game/candy', art: 'candy', g1: '#db2777', g2: '#831843' },
  { id: 'giza', title: 'FORTUNE OF GIZA', provider: 'PG', players: 87, path: '/game/giza', art: 'giza', g1: '#ca8a04', g2: '#713f12' },
  { id: 'fortune', title: 'FORTUNE GEMS', provider: 'PG', players: 35, path: '/game/gems', art: 'gem', g1: '#d97706', g2: '#78350f' },
];

export const exclusive = [
  { id: 'live-1', title: 'Roulette', players: 22, path: '/game/live-roulette', art: 'wheel', g1: '#292d2e', g2: '#1b1e1f' },
  { id: 'live-2', title: 'Blackjack', players: 100, path: '/game/live-blackjack', art: 'dice', g1: '#292d2e', g2: '#1b1e1f' },
  { id: 'live-3', title: 'Crazy Time', players: 48, path: '/game/live-show', art: 'party', g1: '#14532d', g2: '#052e16' },
  { id: 'live-4', title: 'Baccarat', players: 36, path: '/game/live-baccarat', art: 'coin', g1: '#292d2e', g2: '#1b1e1f' },
  { id: 'live-5', title: 'Mega Wheel', players: 61, path: '/game/live-wheel', art: 'wheel', g1: '#1e3a8a', g2: '#172554' },
];

export const highlights = [
  { id: 'hl-1', title: 'Live Roulette', provider: 'LIVE', players: 220, path: '/game/live-roulette', art: 'wheel', g1: '#323738', g2: '#232626' },
  { id: 'hl-2', title: 'Game Shows', provider: 'LIVE', players: 180, path: '/game/live-show', art: 'party', g1: '#323738', g2: '#232626' },
  { id: 'hl-3', title: 'Crash Races', provider: 'ORIGINAL', players: 640, path: '/crash', art: 'crash', g1: '#323738', g2: '#232626' },
  { id: 'hl-4', title: 'High Rollers', provider: 'TABLE', players: 90, path: '/game/live-blackjack', art: 'coin', g1: '#323738', g2: '#232626' },
];

export const allGames = [...originals, ...hotGames, ...exclusive, ...highlights];

export function findGame(slug) {
  return allGames.find((game) => game.path.endsWith(`/${slug}`) || game.id === slug);
}
