const EARTH_RADIUS_MILES = 3959;

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Great-circle distance between two lat/lng points using the haversine
 * formula. Used to compute each station's distance from the user so results
 * can be sorted by proximity and trimmed to the search radius.
 */
export function getDistanceInMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

/**
 * Compute a coarse lat/lng bounding box of `radiusMiles` around a point.
 *
 * This is a cheap pre-filter for the search: rejecting stations outside the
 * box is `O(1)` per station and prunes the dataset before the more expensive
 * haversine distance check runs. The box is intentionally a superset of the
 * true circle (the corners are further than `radiusMiles` from the center),
 * so the precise distance check still has the final say.
 */
export function boundingBox(
  lat: number,
  lng: number,
  radiusMiles: number,
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  const latDelta = (radiusMiles / EARTH_RADIUS_MILES) * (180 / Math.PI);
  const lngDelta = latDelta / Math.cos(deg2rad(lat));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
}
