import type { NextApiRequest, NextApiResponse } from 'next';

import { LIMIT } from 'utils/getFaceToFace';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, isEmbed, savedData } = request.body;

  const isEmbedBool = isEmbed === 'true';

  const data = JSON.parse(savedData);
  const limit = data.limit ? Number(data.limit) + LIMIT : LIMIT + LIMIT;
  const hashLink = limit + 1 - LIMIT;
  delete data['limit'];

  const queryString = Object.keys(data as Record<string, string>)
    .map((key) => {
      return `${key}=${encodeURIComponent(data && key ? data[key] : '')}`;
    })
    .join('&');

  response.redirect(
    302,
    `/${language}/face-to-face-debtline-refer?${queryString}&limit=${String(
      limit,
    )}${addEmbedQuery(isEmbedBool, '&')}#provider-${hashLink}`,
  );
}
