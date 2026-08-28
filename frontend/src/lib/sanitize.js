// Turns a display name into a URL-safe slug fragment. Handles unicode,
// punctuation, extra whitespace, and empty input gracefully.
export function slugifyName(name) {
  return (name || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 24) || 'friend';
}

export function isValidName(name) {
  return typeof name === 'string' && name.trim().length >= 1 && name.trim().length <= 40;
}

export function isValidAmount(amount) {
  if (amount === '' || amount === null || amount === undefined) return true;
  const n = Number(amount);
  return Number.isFinite(n) && n >= 0 && n <= 10000000;
}
