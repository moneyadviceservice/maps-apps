import { ControlPosition, MapControl, useMap } from '@vis.gl/react-google-maps';

import { Button } from '@maps-react/common/components/Button';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export interface SearchNewAreaEvent {
  center: { lat: number; lng: number };
  radius: string;
}

export type SearchNewAreaEventHandler = (event: SearchNewAreaEvent) => void;

const radiusForZoom = (zoom: number): string => {
  if (zoom >= 12) return '5';
  if (zoom >= 11) return '10';
  if (zoom >= 10) return '25';
  return '50';
};

interface SearchAreaControlProps {
  onSearchNewArea?: SearchNewAreaEventHandler;
}

export const SearchAreaControl = ({
  onSearchNewArea,
}: SearchAreaControlProps) => {
  const { z } = useTranslation();
  const map = useMap();

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!map || !onSearchNewArea) return;

    const center = map.getCenter();
    const zoom = map.getZoom();

    onSearchNewArea({
      center: { lat: center.lat(), lng: center.lng() },
      radius: radiusForZoom(zoom),
    });
  };

  return (
    <MapControl position={ControlPosition.BOTTOM_CENTER}>
      <Button variant="secondary" onClick={onClick} className="mb-6">
        {z({ en: 'Search this area', cy: "Chwilio'r ardal hon" })}
      </Button>
    </MapControl>
  );
};
