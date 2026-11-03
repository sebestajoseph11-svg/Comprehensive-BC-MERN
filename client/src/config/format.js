export function money(value) {
  const amount = Number(value || 0);
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function multiplier(value) {
  const amount = Number(value || 0);
  return `${amount.toFixed(2)}×`;
}

export function playersLabel(count) {
  const value = Number(count || 0);
  if (value >= 10000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}
