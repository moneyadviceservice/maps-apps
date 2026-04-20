import type { NextApiRequest, NextApiResponse } from 'next';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

import { geocodePostcode } from '../../utils/FuelFinder/api/geocodePostcode';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { postcode = '', language = 'en', isEmbed } = req.body;
  const trimmed = postcode.trim();
  const isEmbedBool = isEmbed === 'true';
  const basePath = `/${language}`;

  if (!trimmed) {
    const params = new URLSearchParams({ postcodeError: 'empty' });
    return res.redirect(
      303,
      `${basePath}?${params.toString()}${addEmbedQuery(isEmbedBool, '&')}`,
    );
  }

  const result = await geocodePostcode(trimmed);

  if (!result) {
    const params = new URLSearchParams({
      postcode: trimmed,
      postcodeError: 'invalid',
    });
    return res.redirect(
      303,
      `${basePath}?${params.toString()}${addEmbedQuery(isEmbedBool, '&')}`,
    );
  }

  const params = new URLSearchParams({
    postcode: trimmed,
    lat: result.latitude.toString(),
    lng: result.longitude.toString(),
  });

  return res.redirect(
    303,
    `${basePath}/results?${params.toString()}${addEmbedQuery(
      isEmbedBool,
      '&',
    )}`,
  );
}
