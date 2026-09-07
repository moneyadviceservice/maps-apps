import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { FUEL_TYPE_LABELS } from '../../data/fuel-finder';
import { formatPrice } from '../../utils/FuelFinder/formatting/formatPrice';
import type { StationSearchResult } from '../../utils/FuelFinder/types';
import AmenitiesBadges from '../AmenitiesBadges';
import OpeningHours from '../OpeningHours';

interface StationExpandedViewProps {
  station: StationSearchResult;
}

const StationExpandedView = ({ station }: StationExpandedViewProps) => {
  const { z } = useTranslation();

  return (
    <ExpandableSection
      title={z({ en: 'Show details', cy: 'Dangos manylion' })}
      closedTitle={z({ en: 'Hide details', cy: 'Cuddio manylion' })}
      variant="hyperlink"
    >
      <div className="pt-4 space-y-6">
        {station.fuel_prices.length > 0 && (
          <div>
            <h5 className="mb-2 font-bold text-gray-800">
              {z({ en: 'Fuel prices', cy: 'Prisiau tanwydd' })}
            </h5>
            <table className="w-full text-sm" data-testid="fuel-prices-table">
              <thead>
                <tr className="border-b border-slate-400">
                  <th className="py-1 font-normal text-left text-gray-700">
                    {z({ en: 'Fuel type', cy: 'Math o danwydd' })}
                  </th>
                  <th className="py-1 pl-2 font-normal text-right text-gray-700 sm:pl-4">
                    {z({
                      en: 'Price (pence/litre)',
                      cy: 'Pris (ceiniogau/litr)',
                    })}
                  </th>
                  <th className="py-1 pl-2 font-normal text-right text-gray-700 sm:pl-4">
                    {z({ en: 'Last updated', cy: 'Diweddarwyd diwethaf' })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {station.fuel_prices.map((p) => (
                  <tr key={p.fuel_type} className="border-b border-slate-200">
                    <td className="py-1">
                      {FUEL_TYPE_LABELS[p.fuel_type] ?? p.fuel_type}
                    </td>
                    <td className="py-1 pl-2 font-medium text-right sm:pl-4">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-1 pl-2 text-right text-gray-600 sm:pl-4">
                      {new Date(p.price_last_updated).toLocaleDateString(
                        'en-GB',
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div>
          <h5 className="mb-2 font-bold text-gray-800">
            {z({ en: 'Opening hours', cy: 'Oriau Agor' })}
          </h5>
          <OpeningHours hours={station.opening_times} />
        </div>

        <div>
          <h5 className="mb-2 font-bold text-gray-800">
            {z({ en: 'Services', cy: 'Gwasanaethau' })}
          </h5>
          <AmenitiesBadges amenities={station.amenities} />
        </div>
      </div>
    </ExpandableSection>
  );
};

export default StationExpandedView;
