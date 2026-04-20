export interface GeocodeResult {
  latitude: number;
  longitude: number;
  postcode: string;
}

export async function geocodePostcode(
  postcode: string,
): Promise<GeocodeResult | null> {
  try {
    const encoded = encodeURIComponent(postcode.trim());
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encoded}`,
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const result = data?.result;

    if (
      !result ||
      typeof result.latitude !== 'number' ||
      typeof result.longitude !== 'number' ||
      typeof result.postcode !== 'string'
    ) {
      return null;
    }

    return {
      latitude: result.latitude,
      longitude: result.longitude,
      postcode: result.postcode,
    };
  } catch (error) {
    console.error('geocodePostcode failed:', error);
    return null;
  }
}
