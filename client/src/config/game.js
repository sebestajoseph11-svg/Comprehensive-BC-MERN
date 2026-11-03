export const GROWTH = 0.06;

export const amountPresets = [
  { label: '10', value: 10 },
  { label: '100', value: 100 },
  { label: '1.0k', value: 1000 },
  { label: '10.0k', value: 10000 },
];

export const cashoutPresets = [
  { label: '1.01', value: 1.01 },
  { label: '2', value: 2 },
  { label: '10', value: 10 },
  { label: '100', value: 100 },
];

export const trenballSides = [
  { id: 'red', label: 'Crash < 2×', payout: 1.96, color: '#ff5d5d' },
  { id: 'green', label: '≥ 2×', payout: 1.96, color: '#24ee89' },
  { id: 'moon', label: '≥ 10×', payout: 9.6, color: '#8b7cff' },
];

export const depositPacks = [100, 500, 1000, 5000];

export const breakpoints = {
  mobile: 767,
  tablet: 1099,
};
