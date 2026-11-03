export const sidebarNav = [
  {
    id: 'casino',
    label: 'Casino',
    icon: 'dice',
    path: '/',
    children: [
      { id: 'crash', label: 'Crash', path: '/crash' },
      { id: 'originals', label: 'BC Originals', path: '/' },
      { id: 'hot', label: 'Hot Games', path: '/explore' },
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    icon: 'ball',
    path: '/sports',
    children: [
      { id: 'football', label: 'Football', path: '/sports' },
      { id: 'cricket', label: 'Cricket', path: '/sports' },
      { id: 'esports', label: 'Esports', path: '/sports' },
    ],
  },
  {
    id: 'predictions',
    label: 'Predictions',
    icon: 'chart',
    path: '/predictions',
    badge: 'New',
    children: [
      { id: 'markets', label: 'Markets', path: '/predictions' },
    ],
  },
  {
    id: 'lottery',
    label: 'Lottery',
    icon: 'ticket',
    path: '/lottery',
    children: [
      { id: 'draws', label: 'Draws', path: '/lottery' },
    ],
  },
  {
    id: 'futures',
    label: 'Crypto Futures',
    icon: 'futures',
    path: '/futures',
    children: [
      { id: 'btc', label: 'BTC Futures', path: '/futures' },
    ],
  },
  {
    id: 'promotions',
    label: 'Promotions',
    icon: 'gift',
    path: '/promotions',
    children: [
      { id: 'welcome', label: 'Welcome Offer', path: '/promotions' },
    ],
  },
  { id: 'vip', label: 'VIP Club', icon: 'crown', path: '/vip' },
  { id: 'bonus', label: 'Bonus', icon: 'bonus', path: '/bonus' },
  { id: 'guest', label: 'Guest Hub', icon: 'users', path: '/guest' },
  { id: 'referral', label: 'Referral', icon: 'share', path: '/referral' },
  { id: 'forum', label: 'Forum', icon: 'forum', path: '/forum' },
  { id: 'fair', label: 'Provably Fair', icon: 'shield', path: '/fair' },
  { id: 'responsible', label: 'Responsible Gambling', icon: 'scale', path: '/responsible' },
  { id: 'blog', label: 'Blog', icon: 'blog', path: '/blog' },
  { id: 'sponsorships', label: 'Sponsorships', icon: 'megaphone', path: '/sponsorships' },
];

export const sidebarFooter = [
  { id: 'support', label: 'Live Support', icon: 'headset', path: '/support' },
  { id: 'lang', label: 'English', icon: 'globe', action: 'language' },
];

export const sidebarPromos = [
  { id: 'app', kind: 'app', title: 'Application', text: 'Unlock Exclusive App Rewards' },
  { id: 'halloween', kind: 'halloween', title: 'Halloween BC', text: '$1,000,000 Prize Pool' },
  { id: 'token', kind: 'token', title: 'BC Token', price: '$0.03904', change: '+1.30%' },
];

export const headerGuestActions = [
  { id: 'search', kind: 'icon', icon: 'search', desktop: true },
  { id: 'signin', kind: 'button', label: 'Sign In', variant: 'ghost' },
  { id: 'signup', kind: 'button', label: 'Sign Up', variant: 'primary' },
  { id: 'gift', kind: 'icon', icon: 'gift', desktop: true },
  { id: 'lang', kind: 'lang', label: 'USD', desktop: true },
];

export const headerUserActions = [
  { id: 'search', kind: 'icon', icon: 'search', desktop: true },
  { id: 'balance', kind: 'balance' },
  { id: 'deposit', kind: 'button', label: 'Deposit', variant: 'primary', desktop: true },
  { id: 'plus', kind: 'icon', icon: 'plus', variant: 'plus', mobile: true },
  { id: 'gift', kind: 'icon', icon: 'gift' },
  { id: 'bell', kind: 'icon', icon: 'bell' },
  { id: 'avatar', kind: 'avatar' },
];

export const bottomNav = [
  { id: 'menu', label: 'Menu', icon: 'menu', action: 'drawer' },
  { id: 'explore', label: 'Explore', icon: 'search', path: '/explore' },
  { id: 'casino', label: 'Casino', icon: 'dice', path: '/' },
  { id: 'sports', label: 'Sports', icon: 'ball', path: '/sports' },
  { id: 'chat', label: 'Chat', icon: 'chat', path: '/chat' },
];

export const extraPages = [
  { path: '/sports', title: 'Sports', text: 'Football, cricket, and esports markets will be listed here.' },
  { path: '/predictions', title: 'Predictions', text: 'Prediction markets are not open in this demo yet.' },
  { path: '/lottery', title: 'Lottery', text: 'Lottery draws will appear here.' },
  { path: '/futures', title: 'Crypto Futures', text: 'Futures contracts are not available in this demo.' },
  { path: '/promotions', title: 'Promotions', text: 'Promotions use play-money only. No real-money rewards are offered.' },
  { path: '/vip', title: 'VIP Club', text: 'VIP progress is turned off in this demo.' },
  { path: '/bonus', title: 'Bonus', text: 'Bonus offers are not funded with real money.' },
  { path: '/guest', title: 'Guest Hub', text: 'Browse games now, then sign in when you want a play-money balance.' },
  { path: '/referral', title: 'Referral', text: 'Referral rewards are disabled in this demo.' },
  { path: '/forum', title: 'Forum', text: 'The community forum is not connected yet.' },
  { path: '/fair', title: 'Provably Fair', text: 'Each Crash round commits a hash before betting closes. The server seed and crash point are revealed when the round ends.' },
  { path: '/responsible', title: 'Responsible Gambling', text: 'This project is a play-money demo. It does not accept deposits of real funds. If gambling is a problem, seek local support.' },
  { path: '/blog', title: 'Blog', text: 'News and product notes will show up here.' },
  { path: '/sponsorships', title: 'Sponsorships', text: 'Sponsorship stories will show up here.' },
  { path: '/support', title: 'Live Support', text: 'Support chat is offline in this demo. Use the account menu if you need to sign out.' },
  { path: '/chat', title: 'Chat', text: 'Global chat is not connected. The Crash round feed is live on the Crash page.' },
];
