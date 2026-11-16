import type { CoverArea, TripCover } from 'types/travel-insurance-firm';

export function getSelectedCoverAreas(tripCovers: TripCover[]): CoverArea[] {
  const areas = new Set<CoverArea>();
  for (const cover of tripCovers) {
    if (cover.cover_area) {
      areas.add(cover.cover_area);
    }
  }
  return [...areas];
}
