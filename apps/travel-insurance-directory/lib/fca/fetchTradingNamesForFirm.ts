const MAX_NAMES_PAGES = 30;

function getFcaNamesApiEnv(): {
  baseUrl: string;
  key: string;
  email: string;
} {
  return {
    baseUrl: process.env.FCA_API_BASE_URL ?? '',
    key: process.env.FCA_API_KEY ?? '',
    email: process.env.FCA_API_EMAIL ?? '',
  };
}

type FcaNameEntry = {
  Name?: string;
  Status?: string;
  ['Effective From']?: string;
};

type FcaFirmNamesResponse = {
  ResultInfo?: {
    Next?: string | null;
  };
  Data?: Array<{
    ['Current Names']?: FcaNameEntry[];
  }>;
};

function uniqueLowercasePreserveFirst(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item.trim());
  }
  return out;
}

export function extractTradingNamesFromFcaNamesResponse(
  data: FcaFirmNamesResponse,
): string[] {
  const current = data?.Data?.[0]?.['Current Names'] ?? [];
  return current
    .filter((n) => (n?.Status ?? '').toString() === 'Trading')
    .map((n) => (n?.Name ?? '').toString());
}

export function getNextFcaNamesPageUrl(
  data: FcaFirmNamesResponse,
): string | null {
  const next = data?.ResultInfo?.Next;
  if (typeof next !== 'string') return null;
  const trimmed = next.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function fetchJsonNamesPage(
  url: string,
): Promise<
  | { ok: true; data: FcaFirmNamesResponse }
  | { ok: false; status: number }
  | { ok: false; error: string }
> {
  const { key, email } = getFcaNamesApiEnv();
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Auth-Key': key,
        'X-Auth-Email': email,
      },
    });

    if (!response.ok) {
      return { ok: false, status: response.status };
    }

    const data = (await response.json()) as FcaFirmNamesResponse;
    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function fetchTradingNamesForFirmFcaNumber(
  firmFcaNumber: number,
): Promise<{ ok: true; names: string[] } | { ok: false; error: string }> {
  const { baseUrl, key, email } = getFcaNamesApiEnv();
  if (!baseUrl || !key || !email) {
    return { ok: false, error: 'FCA API env vars missing' };
  }

  const firstUrl = `${baseUrl}/Firm/${firmFcaNumber}/Names`;
  const accumulated: string[] = [];

  let url: string | null = firstUrl;

  for (let page = 0; page < MAX_NAMES_PAGES && url; page++) {
    const result = await fetchJsonNamesPage(url);

    if (!result.ok) {
      if ('status' in result) {
        return {
          ok: false,
          error: `FCA names fetch failed (${result.status})`,
        };
      }
      return { ok: false, error: result.error };
    }

    accumulated.push(...extractTradingNamesFromFcaNamesResponse(result.data));

    url = getNextFcaNamesPageUrl(result.data);
  }

  return { ok: true, names: uniqueLowercasePreserveFirst(accumulated) };
}
