const paths = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  search: <><circle cx="11" cy="11" r="6" /><path d="M16 16l4 4" /></>,
  dice: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 9h.01M15 15h.01M12 12h.01" /></>,
  ball: <><circle cx="12" cy="12" r="8" /><path d="M12 4c2 2.5 2 11.5 0 16M4 12h16M7 7c3 1.5 7 1.5 10 0M7 17c3-1.5 7-1.5 10 0" /></>,
  chart: <path d="M4 16l5-5 3 3 8-8M14 6h6v6" />,
  ticket: <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z" />,
  futures: <path d="M4 16c2-6 4-6 6 0s4 6 6 0 4-6 4-4M4 19h16" />,
  gift: <><rect x="4" y="9" width="16" height="11" rx="2" /><path d="M4 13h16M12 9v11M12 9c-2 0-3.5-2.5-2-4s4 1 2 4zm0 0c2 0 3.5-2.5 2-4s-4 1-2 4z" /></>,
  crown: <path d="M4 16l2-8 6 4 6-4 2 8H4zM5 18h14" />,
  bonus: <path d="M12 3l2.2 5.2L20 9l-4 3.6L17.2 19 12 16.2 6.8 19 8 12.6 4 9l5.8-.8L12 3z" />,
  users: <><path d="M8 13a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM16 13a3 3 0 1 0-2.2-5" /><path d="M3 19a5 5 0 0 1 10 0M14 19a5 5 0 0 1 7 0" /></>,
  share: <><circle cx="6" cy="12" r="2" /><circle cx="17" cy="7" r="2" /><circle cx="17" cy="17" r="2" /><path d="M8 11l7-3M8 13l7 3" /></>,
  forum: <path d="M5 16l-1 4 4-2h9a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v6a3 3 0 0 0 2 3z" />,
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
  scale: <path d="M12 4v16M8 20h8M12 7l-5 6h4l1-6zm0 0l5 6h-4l-1-6z" />,
  blog: <><path d="M6 4h9l3 3v13H6z" /><path d="M15 4v3h3M8 11h8M8 15h6" /></>,
  megaphone: <path d="M5 10v4l12 4V6L5 10zm12 1.5v5a3 3 0 0 1 0-5zM7 14.5V18" />,
  headset: <><path d="M4 13a8 8 0 0 1 16 0" /><path d="M4 13v4a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2zm16 0v4a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z" /></>,
  globe: <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2.5 2.5 2.5 11.5 0 16M12 4c-2.5 2.5-2.5 11.5 0 16" /></>,
  chevron: <path d="M9 6l6 6-6 6" />,
  down: <path d="M6 9l6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  bell: <><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16z" /><path d="M10 19a2 2 0 0 0 4 0" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  user: <><circle cx="12" cy="8" r="3" /><path d="M5 19a7 7 0 0 1 14 0" /></>,
  star: <path d="M12 3l2.2 5.2L20 9l-4 3.6L17.2 19 12 16.2 6.8 19 8 12.6 4 9l5.8-.8L12 3z" />,
  heart: <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5" /></>,
  poker: <><rect x="6" y="4" width="8" height="12" rx="1.5" /><rect x="10" y="8" width="8" height="12" rx="1.5" /></>,
  horse: <path d="M6 18c1-6 3-9 6-9 1-3 4-5 6-3-1 2 0 3 1 4 2 1 2 4 1 6h-3l-1 3H6z" />,
  updown: <path d="M7 8l5-4 5 4M7 16l5 4 5-4M12 4v16" />,
  bingo: <><circle cx="12" cy="12" r="8" /><path d="M8 12h8M12 8v8" /></>,
  chat: <path d="M5 16l-1 4 4-2h9a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v6a3 3 0 0 0 2 3z" />,
  eye: <><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /></>,
  eyeOff: <><path d="M3 4l18 16" /><path d="M9.5 6.5A10 10 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.6M6.1 8.2C3.7 9.8 2 12 2 12s4 6 10 6a9 9 0 0 0 3.2-.6" /></>,
};

export default function Icon({ name, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.dice}
    </svg>
  );
}
