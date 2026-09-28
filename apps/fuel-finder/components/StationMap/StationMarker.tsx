import { twMerge } from 'tailwind-merge';
import {
  AdvancedMarker,
  CollisionBehavior,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';

import { H6 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { formatPrice } from '../../utils/FuelFinder/formatting/formatPrice';
import type { MapStation } from '../../utils/FuelFinder/types';

interface StationMarkerProps {
  station: MapStation;
  zIndex: number;
  isOpen: boolean;
  detailsHref: string;
  onOpen: (id: string) => void;
  onClose: (id: string) => void;
}

const StationMarker = ({
  station,
  zIndex,
  isOpen,
  detailsHref,
  onOpen,
  onClose,
}: StationMarkerProps) => {
  const { z } = useTranslation();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const price = station.price === null ? null : formatPrice(station.price);

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: station.lat, lng: station.lng }}
      title={price ? `${station.name}, ${price}` : station.name}
      zIndex={zIndex}
      // Where pins overlap the map hides the lower-ranked one, unless open
      collisionBehavior={
        isOpen
          ? CollisionBehavior.REQUIRED
          : CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
      }
      onClick={() => (isOpen ? onClose(station.id) : onOpen(station.id))}
    >
      {price ? (
        <div
          data-testid="price-pin"
          className={twMerge(
            'whitespace-nowrap rounded-full border border-magenta-500 bg-white px-2 py-0.5 text-xs font-bold text-gray-800 shadow-bottom-gray',
            isOpen && 'border-blue-700 bg-blue-700 text-white',
          )}
        >
          {price}
        </div>
      ) : (
        <div
          data-testid="dot-pin"
          className={twMerge(
            'h-3 w-3 rounded-full border border-white bg-magenta-500 shadow-bottom-gray',
            isOpen && 'bg-blue-700',
          )}
        />
      )}
      {isOpen && (
        <InfoWindow
          anchor={marker}
          onClose={() => onClose(station.id)}
          headerContent={<H6 className="mb-2 -mt-1">{station.name}</H6>}
        >
          {price && (
            <p className="mb-1 font-bold" data-testid="info-window-price">
              {price}
            </p>
          )}
          {station.distance !== null && (
            <p className="mb-3">
              {z(
                { en: '{d} miles away', cy: '{d} milltir i ffwrdd' },
                { d: station.distance.toFixed(1) },
              )}
            </p>
          )}
          <Link href={detailsHref} scroll={false} className="font-bold">
            {z({ en: 'See more details', cy: 'Gweld rhagor o fanylion' })}
          </Link>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default StationMarker;
