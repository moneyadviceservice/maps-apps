import type { Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { uncompress } from '../../utils/compress';

export default async function fetchDataFromBlob(
  req: Request,
  context: Context,
) {
  const store = getStore({
    name: 'budgetPlannerBlobs',
    consistency: 'strong',
  });

  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    let cacheKey: string | null = null;

    if (req.method === 'GET') {
      const url = new URL(req.url);
      cacheKey = url.searchParams.get('key');
    } else {
      const { key } = await req.json();
      cacheKey = key;
    }

    if (!cacheKey) {
      return new Response('Missing cache key', { status: 400 });
    }

    // Retrieve the blob as plain text (our compressed string)
    const data = await store.get(cacheKey, { type: 'text' });

    // If there's no entry for this key, return an empty object
    if (data === null) {
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Uncompress the stored data and parse it back into an object.
    const decompressedJson = await uncompress(data);
    const uncompressedData = JSON.parse(decompressedJson);

    return new Response(JSON.stringify(uncompressedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch data from Netlify Blobs:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
