export function filterTradingNamesBySearch(
  names: readonly string[],
  query: string,
): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...names];
  return names.filter((name) => name.toLowerCase().includes(q));
}
