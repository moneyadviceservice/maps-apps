import { useTranslation } from '@maps-react/hooks/useTranslation';

import { AMENITY_LABELS } from '../../data/fuel-finder';

interface AmenitiesBadgesProps {
  amenities: string[];
}

function formatAmenityLabel(amenity: string): string {
  if (amenity in AMENITY_LABELS) {
    return AMENITY_LABELS[amenity];
  }
  return amenity
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const AmenitiesBadges = ({ amenities }: AmenitiesBadgesProps) => {
  const { z } = useTranslation();

  if (amenities.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        {z({
          en: 'No amenities listed.',
          cy: 'Dim cyfleusterau wedi\u2019u rhestru.',
        })}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" data-testid="amenities-badges">
      {amenities.map((a) => (
        <span
          key={a}
          className="border border-slate-400 rounded shadow-bottom-gray px-4 py-1 text-xs text-gray-800"
        >
          {formatAmenityLabel(a)}
        </span>
      ))}
    </div>
  );
};

export default AmenitiesBadges;
