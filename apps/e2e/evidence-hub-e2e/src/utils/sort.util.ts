export function sortTitlesAlphabetically(titles: string[]): string[] {
  return [...titles].sort((a, b) =>
    a.localeCompare(b, 'en', { sensitivity: 'base' }),
  );
}

export function groupTitlesByYear(
  titles: string[],
  years: number[],
): Map<number, string[]> {
  const groups = new Map<number, string[]>();

  for (let i = 0; i < titles.length; i++) {
    const year = years[i];
    const existing = groups.get(year) ?? [];
    existing.push(titles[i]);
    groups.set(year, existing);
  }

  return groups;
}
