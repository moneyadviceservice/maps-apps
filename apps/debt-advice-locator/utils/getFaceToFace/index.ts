import { ProviderJSON } from 'utils/getOrgData/getData';
import { Client } from '@googlemaps/google-maps-services-js';

import orgs from '../../public/json/organisations-face-to-face.json';
import fileContents from '../../public/json/organisations-lng-lat.json';

const client = new Client({});

export const LIMIT = 8;
export const MAX_RESULTS = 32;

export default async function getOrganisations(
  search: string,
  limit: string,
  loc?: { lat: number; lng: number },
) {
  try {
    const filtered = Math.min(Number(limit), MAX_RESULTS);
    const location = loc ?? (await getLocation(search));

    const filteredLocations = sortLocationsByDistance(
      location,
      fileContents,
    ).splice(0, filtered);

    const providersFiltered = filterData(filteredLocations);

    return {
      providers: providersFiltered,
      location: location,
    };
  } catch (error) {
    return {
      providers: [],
      location: {
        lat: 0,
        lng: 0,
      },
    };
  }
}

async function getLocation(search: string) {
  const geocodeResult = await client.geocode({
    params: {
      address: `${search}, GB`,
      key: process.env.GOOGLE_GEO_API_KEY as string,
    },
  });

  const result = geocodeResult.data.results?.[0];
  const isInUK = result?.address_components?.some(
    (component) =>
      (component.types as string[]).includes('country') &&
      component.short_name === 'GB',
  );

  if (!result || !isInUK) {
    throw new Error('No results found');
  }

  return result.geometry.location;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 3959; // Radius of the earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function sortLocationsByDistance(
  location: { lat: number; lng: number },
  providers: { id: number; lat: number; lng: number }[],
) {
  return providers
    .map((provider) => {
      return {
        ...provider,
        distance: getDistanceFromLatLonInMiles(
          location.lat,
          location.lng,
          provider.lat,
          provider.lng,
        ),
      };
    })
    .sort((a, b) => {
      return a.distance - b.distance;
    });
}

function filterData(
  providers: { id: number; lng: number; lat: number; distance: number }[],
) {
  const ids = providers.map((provider) => Number(provider.id));

  const filtered = ids.reduce((acc, curr) => {
    const provider = orgs.find((p) => Number(p.id) === Number(curr));
    const prov = providers.find((p) => Number(p.id) === Number(curr));
    if (provider) {
      acc.push({
        ...provider,
        distance: prov?.distance.toFixed(2),
      });
    }
    return acc;
  }, [] as ProviderJSON[]);

  return filtered;
}
