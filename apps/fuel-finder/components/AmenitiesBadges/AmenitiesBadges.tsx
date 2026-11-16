import { useTranslation } from '@maps-react/hooks/useTranslation';

import { AMENITY_LABELS } from '../../data/fuel-finder';

interface AmenitiesBadgesProps {
  amenities: string[];
}

// 24-hour fuel is already conveyed by the opening hours section, so it is
// decoded (the amenities bitmask must mirror the encoder) but not badged
const HIDDEN_AMENITIES = new Set(['twenty_four_hour_fuel']);

// Accepts z translation function for bilingual support
function formatAmenityLabel(
  amenity: string,
  z: ReturnType<typeof useTranslation>['z'],
): string {
  if (AMENITY_LABELS[amenity]) {
    return z(AMENITY_LABELS[amenity]);
  }
  return amenity
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const AmenitiesBadges = ({ amenities }: AmenitiesBadgesProps) => {
  const { z } = useTranslation();

  const visibleAmenities = amenities.filter((a) => !HIDDEN_AMENITIES.has(a));

  if (visibleAmenities.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        {z({
          en: 'No services listed.',
          cy: 'Dim gwasanaethau wedi\u2019u rhestru.',
        })}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" data-testid="amenities-badges">
      {visibleAmenities.map((a) => (
        <span
          key={a}
          className="px-4 py-1 text-xs text-gray-800 border rounded border-slate-400 shadow-bottom-gray"
        >
          {formatAmenityLabel(a, z)}
        </span>
      ))}
    </div>
  );
};

export default AmenitiesBadges;
