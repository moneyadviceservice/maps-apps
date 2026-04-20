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
              {z({ en: 'Fuel Prices', cy: 'Prisiau Tanwydd' })}
            </h5>
            <table className="w-full text-sm" data-testid="fuel-prices-table">
              <thead>
                <tr className="border-b border-slate-400">
                  <th className="py-1 text-left font-normal text-gray-700">
                    {z({ en: 'Fuel Type', cy: 'Math o Danwydd' })}
                  </th>
                  <th className="py-1 pl-4 text-right font-normal text-gray-700">
                    {z({
                      en: 'Price (pence/litre)',
                      cy: 'Pris (ceiniog/litr)',
                    })}
                  </th>
                  <th className="py-1 pl-4 text-right font-normal text-gray-700">
                    {z({ en: 'Last Updated', cy: 'Diweddarwyd Ddiwethaf' })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {station.fuel_prices.map((p) => (
                  <tr key={p.fuel_type} className="border-b border-slate-200">
                    <td className="py-1">
                      {FUEL_TYPE_LABELS[p.fuel_type] ?? p.fuel_type}
                    </td>
                    <td className="py-1 pl-4 text-right font-medium">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-1 pl-4 text-right text-gray-600">
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
            {z({ en: 'Opening Hours', cy: 'Oriau Agor' })}
          </h5>
          <OpeningHours hours={station.opening_times} />
        </div>

        <div>
          <h5 className="mb-2 font-bold text-gray-800">
            {z({ en: 'Amenities', cy: 'Cyfleusterau' })}
          </h5>
          <AmenitiesBadges amenities={station.amenities} />
        </div>
      </div>
    </ExpandableSection>
  );
};

export default StationExpandedView;
