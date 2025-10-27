'use client';

import { useCallback, useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';
import { ProviderType } from 'utils/getOrgData/getData';
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';

import { H6, Link } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

import { DebtAdvisorLocationCard } from '../DebtAdvisorLocationCard/DebtAdvisorLocationCard';

type Props = {
  providers: ProviderType[];
  location: { lat: number; lng: number };
  infoWindowShown: number | null;
  selectedIndex: number | null;
  handleMarkerClick: (index: number) => void;
  handleClose: (index: number) => void;
  onSelected: (index: number) => void;
};

const GoogleMap = ({
  providers,
  location,
  infoWindowShown,
  selectedIndex,
  handleMarkerClick,
  handleClose,
  onSelected,
}: Props) => {
  return (
    <div className="h-[340px] lg:h-[600px] w-full lg:ml-6">
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      >
        <Map
          mapId={'debt-advice-locator'}
          defaultZoom={12}
          defaultCenter={location}
        >
          <AdvancedMarker
            key={'marker'}
            position={{
              lat: location.lat,
              lng: location.lng,
            }}
          />
          {providers.map((provider, index) => (
            <GoogleMapMarkerWithInfoWindow
              key={provider.id}
              provider={provider}
              index={index}
              infoWindowShown={infoWindowShown === index}
              selectedIndex={selectedIndex}
              handleMarkerClick={handleMarkerClick}
              handleClose={handleClose}
              onSelected={onSelected}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

export const GoogleMapMarkerWithInfoWindow = ({
  provider,
  index,
  infoWindowShown,
  selectedIndex,
  handleMarkerClick,
  handleClose,
  onSelected,
}: {
  provider: ProviderType;
  index: number;
  infoWindowShown: boolean;
  selectedIndex: number | null;
  handleMarkerClick: (index: number) => void;
  handleClose: (index: number) => void;
  onSelected: (index: number) => void;
}) => {
  const { z } = useTranslation();
  const [markerRef, marker] = useAdvancedMarkerRef();

  // Skip rendering if provider has invalid coordinates
  if (!Number.isFinite(provider.lat) || !Number.isFinite(provider.lng)) {
    return null;
  }

  return (
    <AdvancedMarker
      ref={markerRef}
      onClick={() => handleMarkerClick(index)}
      key={provider.id}
      zIndex={index === selectedIndex ? 1 : 0}
      position={{
        lat: provider.lat as number,
        lng: provider.lng as number,
      }}
    >
      <div className="relative flex items-center justify-center">
        {infoWindowShown && (
          <InfoWindow
            anchor={marker}
            onClose={() => handleClose(index)}
            headerContent={<H6 className="mb-2 -mt-1">{provider.name}</H6>}
          >
            <p className="mb-3 font-bold">
              {provider.distance}{' '}
              {z({ en: 'miles away', cy: 'Milltiroedd i ffwrdd' })}
            </p>
            <Link
              href="#"
              className="font-bold"
              onClick={(e) => {
                e.preventDefault();
                onSelected(index);
              }}
            >
              {z({
                en: 'More info',
                cy: 'Rhagor o wybodaeth',
              })}
            </Link>
          </InfoWindow>
        )}
        <span
          className={twMerge(
            'absolute flex items-center font-bold text-white',
            index === selectedIndex
              ? 'text-[14px] top-[14px]'
              : 'text-[12px] top-[12px]',
          )}
        >
          {index + 1}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="54"
          height={index === selectedIndex ? '52' : '42'}
          viewBox="0 0 54 70"
          fill="none"
        >
          <path
            d="M26.5 7C15.7476 7 7 15.7022 7 26.3987C7 42.3359 24.559 57.8971 25.3068 58.552C25.6477 58.8505 26.0737 59 26.5 59C26.9263 59 27.3523 58.8507 27.6934 58.552C28.4408 57.8973 46 42.3361 46 26.3987C46 15.7022 37.2524 7 26.5 7ZM26.5 20.9529C29.4868 20.9529 31.9167 23.3959 31.9167 26.3987C31.9167 29.4016 29.4868 31.8445 26.5 31.8445C23.5132 31.8445 21.0833 29.4016 21.0833 26.3987C21.0833 23.3959 23.5132 20.9529 26.5 20.9529Z"
            fill={index === selectedIndex ? '#0F19A0' : '#C82A87'}
          />
          <ellipse
            cx="27"
            cy="27"
            rx="8"
            ry="9"
            fill={index === selectedIndex ? '#0F19A0' : '#C82A87'}
          />
        </svg>
      </div>
    </AdvancedMarker>
  );
};

export const DebtAdvisorLocationMap = ({
  location,
  providers,
  lang,
}: {
  providers: ProviderType[];
  location: { lat: number; lng: number };
  lang: string;
}) => {
  const [infoWindowShown, setInfoWindowShown] = useState<number | null>(null);
  const [selected, setSelected] = useState<number>(0);
  const [showChild, setShowChild] = useState(false);

  // Wait until after client-side hydration to show
  useEffect(() => {
    setShowChild(true);
  }, []);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback((index: number) => {
    setInfoWindowShown(index);
  }, []);

  const selectedProvider = useCallback((index: number) => {
    setSelected(index);
    document.getElementById(`provider-${index}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback((index: number) => {
    setInfoWindowShown(index);
  }, []);

  if (!showChild || providers.length === 0) {
    return (
      <>
        {providers?.map((provider: ProviderType, index: number) => (
          <DebtAdvisorLocationCard
            selected={false}
            key={provider.id}
            provider={provider}
            lang={lang}
            number={index + 1}
          />
        ))}
      </>
    );
  }

  return (
    <div className="relative grid lg:grid-cols-2">
      <div className="relative mt-8 lg:order-2">
        <div className="sticky top-6 lg:mr-6">
          <GoogleMap
            location={location}
            selectedIndex={selected}
            providers={providers}
            infoWindowShown={infoWindowShown}
            handleMarkerClick={handleMarkerClick}
            handleClose={handleClose}
            onSelected={(index) => selectedProvider(index)}
          />
        </div>
      </div>
      <div className="lg:order-1">
        {providers?.map((provider: ProviderType, index: number) => (
          <DebtAdvisorLocationCard
            selected={selected === index}
            key={provider.id}
            provider={provider}
            lang={lang}
            number={index + 1}
          />
        ))}
      </div>
    </div>
  );
};
