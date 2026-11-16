/**
 * Returns a safe, valid daysPerWeek value (defaults to 5 if input is falsy or invalid).
 */
export function getDaysPerWeek(daysPerWeek?: string | number): number {
  const n = typeof daysPerWeek === 'string' ? Number(daysPerWeek) : daysPerWeek;
  return n && n > 0 ? n : 5;
}
