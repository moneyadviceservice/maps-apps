import { Client } from '@googlemaps/google-maps-services-js';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  postcode: string;
}

const client = new Client({});

export async function geocodePostcode(
  postcode: string,
): Promise<GeocodeResult | null> {
  try {
    const trimmed = postcode.trim();
    const geocodeResult = await client.geocode({
      params: {
        address: `${trimmed}, GB`,
        key: process.env.GOOGLE_MAPS_API_KEY as string,
      },
    });

    const result = geocodeResult.data.results?.[0];

    const isInUK = result?.address_components?.some(
      (component) =>
        (component.types as string[]).includes('country') &&
        component.short_name === 'GB',
    );

    if (!result || !isInUK) {
      return null;
    }

    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      postcode: trimmed,
    };
  } catch (error) {
    console.error('geocodePostcode failed:', error);
    return null;
  }
}
