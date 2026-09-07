import { useTranslation } from '@maps-react/hooks/useTranslation';

import type {
  FuelType,
  StationSearchResult,
} from '../../utils/FuelFinder/types';
import StationCard, { StationCardSkeleton } from '../StationCard';

interface StationListProps {
  stations: StationSearchResult[];
  selectedFuelTypes: FuelType[];
  isLoading?: boolean;
  skeletonCount?: number;
}

const StationList = ({
  stations,
  selectedFuelTypes,
  isLoading = false,
  skeletonCount,
}: StationListProps) => {
  const { z } = useTranslation();
  const count = skeletonCount ?? stations.length;

  return (
    <div className="mb-3">
      <div
        className="space-y-8"
        aria-busy={isLoading}
        aria-live="polite"
        data-testid="station-list"
      >
        {isLoading && (
          <output className="sr-only">
            {z({ en: 'Loading results', cy: 'Llwytho canlyniadau' })}
          </output>
        )}
        {isLoading
          ? Array.from({ length: count }, (_, i) => (
              <StationCardSkeleton key={i} />
            ))
          : stations.map((station) => (
              <StationCard
                key={station.node_id}
                station={station}
                selectedFuelTypes={selectedFuelTypes}
              />
            ))}
      </div>
    </div>
  );
};

export default StationList;
