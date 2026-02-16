async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Netlify Functions request failed (${res.status}): ${errorText}`,
    );
  }
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}
const baseUrl =
  process.env.URL ?? // Netlify production URL
  process.env.DEPLOY_PRIME_URL ?? // Netlify preview/branch URL
  process.env.DEPLOY_URL; // Netlify specific deployment URL
export async function saveDataToCache(
  queryData: Record<string, any>,
  cacheName: string,
): Promise<any> {
  const response = await fetch(`${baseUrl}/.netlify/functions/saveDataToBlob`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ queryData, cacheName }),
  });
  return handleResponse<any>(response);
}

export async function fetchDataFromCache<T = any>(key: string): Promise<T> {
  const response = await fetch(
    `${baseUrl}/.netlify/functions/fetchDataFromBlob?key=${encodeURIComponent(
      key,
    )}`,
    {
      method: 'GET',
    },
  );
  return handleResponse<T>(response);
}
