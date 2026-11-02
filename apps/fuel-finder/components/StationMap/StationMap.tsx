import { useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapEvent,
} from '@vis.gl/react-google-maps';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import pageFilters, {
  extractSearchFilters,
} from '../../utils/FuelFinder/filters/pageFilters';
import {
  rankByPrice,
  stationAnchorId,
} from '../../utils/FuelFinder/map/mapStations';
import {
  boundingBox,
  getDistanceInMiles,
} from '../../utils/FuelFinder/search/geo';
import type { MapStation } from '../../utils/FuelFinder/types';
import {
  SearchAreaControl,
  SearchNewAreaEventHandler,
} from './SearchAreaControl';
import StationMarker from './StationMarker';

const MOVE_DISTANCE = 0.25; // how far the camera must move from the center, in miles, before it is counted as moved
const MAP_ID = 'fuel-finder';
interface StationMapProps {
  apiKey: string;
  stations: MapStation[];
  onSearchNewArea: SearchNewAreaEventHandler;
}
interface MapCamera {
  center: { lat: number; lng: number };
  zoom: number;
}

const StationMap = ({ apiKey, stations, onSearchNewArea }: StationMapProps) => {
  const { z } = useTranslation();
  const router = useRouter();
  const filters = pageFilters(router);
  const { lat, lng } = extractSearchFilters(router.query);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showSearchAreaControl, setShowSearchAreaControl] = useState(false); // Used to determine if the ShowSearchAreaControl should display
  const [mapCamera, setMapCamera] = useState<MapCamera | null>(null); // Used to calculate how far the camera has moved
  const [searchArea, setSearchArea] = useState(false); // Used to determine what defaults are used by the map component
  const zIndexes = useMemo(() => rankByPrice(stations), [stations]);

  if (lat == null || lng == null) return null;

  const box = boundingBox(lat, lng, Number(filters.radius));

  const RADIUS_ZOOM: Record<string, number> = {
    '5': 12,
    '10': 11,
    '25': 10,
    '50': 9,
  };

  const defaultCenter = { lat, lng };
  const defaultZoom = RADIUS_ZOOM[Number(filters.radius)];
  const defaultBounds = {
    north: box.maxLat,
    south: box.minLat,
    east: box.maxLng,
    west: box.minLng,
  };

  const detailsHrefFor = (station: MapStation) => {
    const anchor = `#${stationAnchorId(station.id)}`;
    return station.page === filters.page
      ? anchor
      : `${filters.setPageHref(station.page)}${anchor}`;
  };

  const close = (id: string) =>
    setOpenId((current) => (current === id ? null : current));

  const onIdle = (event: MapEvent) => {
    const parseEvent = (event: MapEvent) => {
      const center = event.map.getCenter();
      const zoom = event.map.getZoom();

      return {
        center: { lat: center.lat(), lng: center.lng() },
        zoom: zoom,
      };
    };

    const { center, zoom } = parseEvent(event);

    const eventMapCamera: MapCamera = {
      center,
      zoom,
    };

    if (mapCamera == null) {
      // first time the map loads it is with the defaultBounds
      setMapCamera(eventMapCamera);
    } else {
      // always update the map camera
      const movedDistance = getDistanceInMiles(
        mapCamera.center.lat,
        mapCamera.center.lng,
        center.lat,
        center.lng,
      );
      const zoomDelta = mapCamera.zoom - zoom;

      if (
        (Number.isFinite(movedDistance) && movedDistance > MOVE_DISTANCE) ||
        zoomDelta != 0
      ) {
        setShowSearchAreaControl(true);
      }
    }
  };

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
          defaultBounds={!searchArea ? defaultBounds : undefined}
          defaultCenter={searchArea ? defaultCenter : undefined}
          defaultZoom={searchArea ? defaultZoom : undefined} // consistent zoom based on radius
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          onIdle={onIdle}
        >
          <AdvancedMarker
            position={{ lat, lng }}
            title={z({
              en: 'Your search location',
              cy: 'Lleoliad eich chwiliad',
            })}
          />
          {showSearchAreaControl && (
            <SearchAreaControl
              onSearchNewArea={(event) => {
                setShowSearchAreaControl(false);
                setSearchArea(true);
                onSearchNewArea(event);
              }}
            />
          )}
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
