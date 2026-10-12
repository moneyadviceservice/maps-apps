import type { CompactData, Station, StationsData } from '../types';
import { decodeStationData } from './decodeStationData';

type Result = {
  data: StationsData;
  version: number | null;
  source: 'compact' | 'fallback';
  compactError?: unknown;
};

const normalizeSasToken = (token?: string): string => {
  if (!token) return '';
  const trimmed = token.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('?') ? trimmed : `?${trimmed}`;
};

export async function fetchStationsWithFallback(
  baseUrl: string,
  sasToken?: string,
): Promise<Result> {
  const query = normalizeSasToken(sasToken);

  const fetchJson = async (file: string): Promise<unknown> => {
    const res = await fetch(`${baseUrl}${file}${query}`);
    if (!res.ok) throw new Error(`Blob storage returned ${res.status}`);
    return res.json();
  };

  let compactErr: unknown;
  try {
    const body = (await fetchJson('stations.compact.json.br')) as CompactData;
    return {
      data: decodeStationData(body),
      version: body.v,
      source: 'compact',
    };
  } catch (err) {
    compactErr = err;
  }

  try {
    const body = (await fetchJson('stations.json.gz')) as {
      fetchedAt?: string;
      stations?: Station[];
    };
    if (!body?.fetchedAt || !Array.isArray(body.stations)) {
      throw new Error('Blob storage returned malformed payload');
    }
    return {
      data: { fetchedAt: body.fetchedAt, stations: body.stations },
      version: null,
      source: 'fallback',
      compactError: compactErr,
    };
  } catch (fallbackErr) {
    throw new Error('Failed to fetch stations', {
      cause: { compact: compactErr, fallback: fallbackErr },
    });
  }
}
