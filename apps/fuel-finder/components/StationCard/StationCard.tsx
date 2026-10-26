import { useEffect, useRef } from 'react';

import { H4 } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { formatPrice } from '../../utils/FuelFinder/formatting/formatPrice';
import { stationAnchorId } from '../../utils/FuelFinder/map/mapStations';
import type {
  FuelType,
  StationSearchResult,
} from '../../utils/FuelFinder/types';
import StationExpandedView from '../StationExpandedView';

interface StationCardProps {
  station: StationSearchResult;
  selectedFuelTypes: FuelType[];
  isSelected?: boolean;
}

const badgeClass =
  'border border-slate-400 rounded shadow-bottom-gray px-4 py-1 text-xs text-gray-800';

const StationCard = ({
  station,
  selectedFuelTypes,
  isSelected = false,
}: StationCardProps) => {
  const { z } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSelected) return;
    cardRef.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({ block: 'start' });
  }, [isSelected]);

  const fuelPrice = station.fuel_prices.find(
    (p) => p.fuel_type === selectedFuelTypes[0],
  );

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.location.latitude},${station.location.longitude}`;

  const hasTags =
    station.is_supermarket_service_station ||
    station.is_motorway_service_station;

  return (
    <InformationCallout
      testClass="station"
      variant="withShadow"
      className={isSelected ? 'border-2 border-blue-700' : undefined}
    >
      <div
        ref={cardRef}
        data-testid="station-card"
        id={stationAnchorId(station.node_id)}
        tabIndex={-1}
        className="px-6 pt-6 pb-8 outline-none scroll-mt-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between">
          <div>
            <H4 component="h2" color="text-gray-800" className="!mb-0">
              {station.trading_name}
            </H4>

            {station.brand_name && !station.is_same_trading_and_brand_name && (
              <p className="mt-1 text-lg text-gray-800">{station.brand_name}</p>
            )}
          </div>

          {fuelPrice && (
            <H4
              component="h3"
              className="mt-2 lg:mt-0 lg:shrink-0"
              data-testid="station-price"
            >
              {formatPrice(fuelPrice.price)}
            </H4>
          )}
        </div>

        {hasTags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {station.is_supermarket_service_station && (
              <span className={badgeClass}>
                {z({ en: 'Supermarket', cy: 'Archfarchnad' })}
              </span>
            )}
            {station.is_motorway_service_station && (
              <span className={badgeClass}>
                {z({ en: 'Motorway', cy: 'Traffordd' })}
              </span>
            )}
          </div>
        )}

        <hr className="my-4 border-slate-400" />

        {station.distance != null && (
          <p
            className="text-lg font-bold text-gray-800"
            data-testid="station-distance"
          >
            {z(
              { en: '{d} miles away', cy: '{d} milltir i ffwrdd' },
              { d: station.distance.toFixed(1) },
            )}
          </p>
        )}

        <p className="text-lg text-gray-800">
          {station.location.address_line_1}, {station.location.postcode}
        </p>

        <div className="mt-3">
          <Link
            href={directionsUrl}
            withIcon={false}
            target="_blank"
            rel="noopener noreferrer"
          >
            {z({
              en: 'View on Google Maps (opens in new tab)',
              cy: 'Gweld ar Google Maps (yn agor mewn tab newydd)',
            })}
          </Link>
        </div>

        <hr className="my-4 border-slate-400" />

        <StationExpandedView station={station} open={isSelected} />
      </div>
    </InformationCallout>
  );
};

export default StationCard;
