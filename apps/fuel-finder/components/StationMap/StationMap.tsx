import { useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import pageFilters, {
  extractSearchFilters,
} from '../../utils/FuelFinder/filters/pageFilters';
import {
  rankByPrice,
  stationAnchorId,
} from '../../utils/FuelFinder/map/mapStations';
import { boundingBox } from '../../utils/FuelFinder/search/geo';
import type { MapStation } from '../../utils/FuelFinder/types';
import StationMarker from './StationMarker';

const MAP_ID = 'fuel-finder';

export interface StationMapProps {
  apiKey: string;
  stations: MapStation[];
}

const StationMap = ({ apiKey, stations }: StationMapProps) => {
  const { z } = useTranslation();
  const router = useRouter();
  const filters = pageFilters(router);
  const { lat, lng } = extractSearchFilters(router.query);
  const [openId, setOpenId] = useState<string | null>(null);
  const zIndexes = useMemo(() => rankByPrice(stations), [stations]);

  if (lat == null || lng == null) return null;

  const box = boundingBox(lat, lng, Number(filters.radius));

  const detailsHrefFor = (station: MapStation) => {
    const anchor = `#${stationAnchorId(station.id)}`;
    return station.page === filters.page
      ? anchor
      : `${filters.setPageHref(station.page)}${anchor}`;
  };

  const close = (id: string) =>
    setOpenId((current) => (current === id ? null : current));

  return (
    <section
      aria-label={z({
        en: 'Map of petrol stations',
        cy: 'Map o orsafoedd petrol',
      })}
      data-testid="station-map"
      className="h-[340px] w-full xl:h-auto xl:aspect-square"
    >
      <APIProvider apiKey={apiKey}>
        <Map
          mapId={MAP_ID}
          defaultBounds={{
            north: box.maxLat,
            south: box.minLat,
            east: box.maxLng,
            west: box.minLng,
          }}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
        >
          <AdvancedMarker
            position={{ lat, lng }}
            title={z({
              en: 'Your search location',
              cy: 'Lleoliad eich chwiliad',
            })}
          />
          {stations.map((station, index) => {
            const isOpen = station.id === openId;
            return (
              <StationMarker
                key={station.id}
                station={station}
                zIndex={isOpen ? stations.length + 1 : zIndexes[index]}
                isOpen={isOpen}
                detailsHref={detailsHrefFor(station)}
                onOpen={setOpenId}
                onClose={close}
              />
            );
          })}
        </Map>
      </APIProvider>
    </section>
  );
};

export default StationMap;
