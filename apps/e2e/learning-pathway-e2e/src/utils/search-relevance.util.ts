export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

/** Counts how many distinct query words appear in the given text. */
export function countKeywordHits(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  return tokenize(query).filter((word) => lowerText.includes(word)).length;
}

/** Whether the exact query phrase appears in the given text. */
export function containsPhrase(text: string, phrase: string): boolean {
  return text.toLowerCase().includes(phrase.toLowerCase().trim());
}

/** Parses the DD/MM/YYYY format rendered on document cards. */
export function parseUkDate(date: string): number {
  const [day, month, year] = date.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
}
