import { NextApiRequest, NextApiResponse } from 'next';

import { removeDataFromMemory } from 'lib/util/cache/cache';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const {
    body,
    query: { sectionName, id },
  } = request;
  const { language, tabName } = body;

  try {
    removeDataFromMemory(body, tabName, Number(id), String(sectionName));
  } catch {
    console.warn('Failed to remove item');
  }

  return response.redirect(`/${language}/${tabName}`);
}
