import type { NextApiRequest, NextApiResponse } from 'next';

import { databaseClient } from '../../lib/util/databaseClient';
import { DATABASE_ID, DATABASE_NAME } from '../../utils';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    headers: { referer },
  } = request;

  const { urn, language } = request.body;

  const { search, pathname } = new URL(referer ?? '');

  const params = new URLSearchParams(search);

  if (!validateURN(urn)) {
    params.set('error', 'format');
    response.redirect(302, `${pathname}?${params.toString()}`);
  }

  try {
    const initConnectionToDb = await databaseClient(
      DATABASE_NAME ?? '',
      DATABASE_ID ?? '',
    );

    const existingEntry = urn ? await initConnectionToDb.searchById(urn) : null;

    if (existingEntry?.data) {
      params.delete('error');

      Object.keys(existingEntry.data).forEach((key) => {
        params.set(key, existingEntry.data[key]);
      });
      params.set('urn', urn);
      response.redirect(
        302,
        `/${language}/pension-wise-appointment/client-summary?${params.toString()}`,
      );
    } else {
      params.set('error', 'urn');
      response.redirect(302, `${pathname}?${params.toString()}`);
    }
  } catch (error) {
    console.error(error);
    params.set('error', 'access');
    response.redirect(302, `${pathname}?${params.toString()}`);
  }
}

const validateURN = (urn: string) => /^P[A-Z]{2}\d-\d[A-Z]{3}$/.exec(urn);
