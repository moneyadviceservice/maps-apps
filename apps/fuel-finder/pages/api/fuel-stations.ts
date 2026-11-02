import type { NextApiRequest, NextApiResponse } from 'next';

import { fetchStationsWithFallback } from '../../utils/FuelFinder/api/fetchStations';

const secondsUntilMinute = (now: Date, minute: number): number => {
  const next = new Date(now);
  next.setMinutes(minute, 0, 0);
  if (now >= next) next.setHours(next.getHours() + 1);
  return Math.ceil((next.getTime() - now.getTime()) / 1000);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const baseUrl = process.env.STATIONS_BLOB_URL;
  if (!baseUrl) {
    return res.status(500).json({ error: 'STATIONS_BLOB_URL is not set' });
  }

  const sasToken = process.env.AZURE_SAS_TOKEN;

  try {
    const { data, version, source, compactError } =
      await fetchStationsWithFallback(baseUrl, sasToken);

    if (compactError) {
      console.warn(
        'fuel-stations: compact fetch failed, using fallback:',
        compactError,
      );
    }

    // Blob refreshes hourly at ~:35; expire CDN at :38 so it refetches shortly after.
    const cdnTtl = secondsUntilMinute(new Date(), 38);
    res.setHeader(
      'Netlify-CDN-Cache-Control',
      `public, durable, s-maxage=${cdnTtl}, stale-while-revalidate=60`,
    );

    console.log('fuel-stations: serving stations', {
      count: data.stations.length,
      fetchedAt: data.fetchedAt,
      source,
      version,
      cdnTtl,
      sasTokenPresent: Boolean(sasToken?.trim()),
    });

    return res.status(200).json(data);
  } catch (err) {
    console.error('fuel-stations handler failed:', err);
    return res.status(502).json({ error: 'Failed to fetch stations' });
  }
}
