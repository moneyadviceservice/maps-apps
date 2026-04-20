import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import type {
  FuelType,
  StationSearchResult,
} from '../../utils/FuelFinder/types';
import StationCard from '../StationCard';

interface StationListProps {
  stations: StationSearchResult[];
  totalItems: number;
  hasSearched: boolean;
  selectedFuelTypes: FuelType[];
  hasActiveFilters?: boolean;
  clearFiltersHref?: string;
}

const StationList = ({
  stations,
  totalItems,
  hasSearched,
  selectedFuelTypes,
  hasActiveFilters,
  clearFiltersHref = '/',
}: StationListProps) => {
  const { z } = useTranslation();

  if (!hasSearched) {
    return (
      <div className="py-12 text-center text-gray-600">
        {z({
          en: 'Enter a postcode to find nearby fuel stations.',
          cy: 'Rhowch god post i ddod o hyd i orsafoedd tanwydd cyfagos.',
        })}
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div className="space-y-8">
        {totalItems === 0 && (
          <div className="p-3 border">
            <div className="max-w-lg text-gray-900 text-md">
              {hasActiveFilters ? (
                <>
                  <div className="mb-3">
                    {z({
                      en: 'There are no results that match your selected filters and search terms.',
                      cy: "Nid oes canlyniadau sy'n cyfateb i'ch hidlwyr a thermau chwilio.",
                    })}
                  </div>
                  <div>
                    {z({
                      en: 'Update your filters and search terms by removing tags in the applied filters section above. Or you can ',
                      cy: 'Diweddarwch eich hidlwyr a thermau chwilio drwy dynnu tagiau yn yr adran hidlwyr uchod. Neu gallwch ',
                    })}
                    <Link href={clearFiltersHref}>
                      {z({
                        en: 'reset the filters',
                        cy: 'ailosod yr hidlwyr',
                      })}
                    </Link>
                    {z({ en: ' and start over.', cy: ' a dechrau eto.' })}
                  </div>
                </>
              ) : (
                <div>
                  {z({
                    en: 'There are no results that match your location. Use the filters below to adjust your search.',
                    cy: "Nid oes canlyniadau sy'n cyfateb i'ch lleoliad. Defnyddiwch yr hidlwyr isod i addasu eich chwiliad.",
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        {stations.map((station) => (
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
