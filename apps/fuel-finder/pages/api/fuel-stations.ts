import type { NextApiRequest, NextApiResponse } from 'next';

import { decodeStationData } from '../../utils/FuelFinder/api/decodeStationData';
import type {
  CompactData,
  Station,
  StationsData,
} from '../../utils/FuelFinder/types';

const STATIONS_FILES = {
  compact: 'stations.compact.json.br',
  fallback: 'stations.json.gz',
} as const;

type FetchResult = { data: StationsData; version: number | null };

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Blob storage returned ${res.status}`);
  return res.json();
}

async function fetchCompact(url: string): Promise<FetchResult> {
  const body = (await fetchJson(url)) as CompactData;
  // decodeStationData throws on missing/wrong version or shape mismatch
  return { data: decodeStationData(body), version: body.v };
}

async function fetchVerbose(url: string): Promise<FetchResult> {
  const body = (await fetchJson(url)) as {
    fetchedAt?: string;
    stations?: Station[];
  };
  if (!body?.fetchedAt || !Array.isArray(body.stations)) {
    throw new Error('Blob storage returned malformed payload');
  }
  return {
    data: { fetchedAt: body.fetchedAt, stations: body.stations },
    version: null,
  };
}

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

  const compactUrl = `${baseUrl}${STATIONS_FILES.compact}`;
  const fallbackUrl = `${baseUrl}${STATIONS_FILES.fallback}`;

  let result: FetchResult;
  let source: 'compact' | 'fallback';

  try {
    result = await fetchCompact(compactUrl);
    source = 'compact';
  } catch (compactErr) {
    console.warn(
      'fuel-stations: compact fetch/decode failed, trying fallback:',
      compactErr,
    );
    try {
      result = await fetchVerbose(fallbackUrl);
      source = 'fallback';
    } catch (fallbackErr) {
      console.error('fuel-stations handler failed:', {
        compact: compactErr,
        fallback: fallbackErr,
      });
      return res.status(502).json({ error: 'Failed to fetch stations' });
    }
  }

  const { data: decoded, version } = result;
  const versionLabel = version == null ? 'verbose' : `v${version}`;

  // Blob store refreshes hourly at ~:35. Sync CDN cache expiry to :38 so it
  // refetches shortly after new data lands, rather than on a fixed TTL.
  const now = new Date();
  const nextRefresh = new Date(now);
  nextRefresh.setMinutes(38, 0, 0);
  if (now >= nextRefresh) {
    nextRefresh.setHours(nextRefresh.getHours() + 1);
  }
  const secondsUntilRefresh = Math.ceil(
    (nextRefresh.getTime() - now.getTime()) / 1000,
  );

  res.setHeader(
    'Netlify-CDN-Cache-Control',
    `public, durable, s-maxage=${secondsUntilRefresh}, stale-while-revalidate=60`,
  );

  console.log(
    `fuel-stations: serving ${decoded.stations.length} stations, fetchedAt=${decoded.fetchedAt}, source=${source}, version=${versionLabel}, CDN TTL=${secondsUntilRefresh}s`,
  );

  return res.status(200).json(decoded);
}
