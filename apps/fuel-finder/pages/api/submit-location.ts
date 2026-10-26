import type { NextApiRequest, NextApiResponse } from 'next';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

import { geocodePostcode } from '../../utils/FuelFinder/api/geocodePostcode';
import { readFuelType } from '../../utils/FuelFinder/filters/pageFilters';
import { isValidLocationInput } from '../../utils/FuelFinder/validation/isValidLocationInput';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { location, language, isEmbed } = req.body;

  const locale = language === 'cy' ? 'cy' : 'en';
  const trimmed = typeof location === 'string' ? location.trim() : '';

  // Echoed on every redirect so the selection survives error round-trips;
  // anything invalid normalises to the E10 default.
  const fuelType = readFuelType(req.body);

  const redirectTo = (path: string, params: Record<string, string>) =>
    res.redirect(
      303,
      `/${locale}${path}?${new URLSearchParams({
        ...params,
        fuelType,
      })}${addEmbedQuery(isEmbed === 'true', '&')}`,
    );

  if (!trimmed) {
    return redirectTo('', { locationError: 'empty' });
  }

  if (!isValidLocationInput(trimmed)) {
    return redirectTo('', { location: trimmed, locationError: 'invalid' });
  }

  const result = await geocodePostcode(trimmed);

  if (!result) {
    return redirectTo('', { location: trimmed, locationError: 'invalid' });
  }

  return redirectTo('/results', {
    lat: result.latitude.toString(),
    lng: result.longitude.toString(),
  });
}
