import type { Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { compress, uncompress } from '../../utils/compress';

export default async function saveDataToBlob(req: Request, context: Context) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const store = getStore({
    name: 'budgetPlannerBlobs',
    consistency: 'strong',
  });

  try {
    // Expecting JSON body: { queryData: Record<string, any>, cacheName: string }
    const { queryData, cacheName } = await req.json();

    if (!queryData || !cacheName) {
      return new Response('Missing queryData or cacheName', { status: 400 });
    }

    const currentTime = Date.now();

    // Retrieve existing blob as plain text (our compressed string) along with metadata.
    const existingBlob = await store.getWithMetadata(cacheName, {
      type: 'text',
    });

    if (existingBlob?.data) {
      // Decompress the stored data and parse it.
      const decompressedJson = await uncompress(existingBlob.data);
      const uncompressedData = JSON.parse(decompressedJson) as Record<
        string,
        any
      >;
      const timestamp = (existingBlob.metadata?.timestamp as number) ?? 0;
      const expiration = timestamp + 6 * 60 * 60 * 1000; // 6 hours
      const timeLeft = expiration - currentTime;

      const shouldReset =
        Object.keys(uncompressedData).length === 0 ||
        Object.keys(queryData).length === 0 ||
        queryData['reset'] === 'true';

      if (shouldReset) {
        // Delete the key entirely
        await store.delete(cacheName);
        return new Response(`Cache "${cacheName}" was reset`, { status: 200 });
      } else if (timeLeft > 0) {
        // Merge with existing data.
        const updatedData = { ...uncompressedData, ...queryData };
        // Compress updated data.
        const compressedData = await compress(JSON.stringify(updatedData));
        // Save with the same timestamp.
        await store.set(cacheName, compressedData, {
          metadata: { timestamp },
        });
        return new Response(`Data merged and saved for "${cacheName}"`, {
          status: 200,
        });
      } else {
        // Expired: store fresh data with new timestamp.
        const compressedData = await compress(JSON.stringify(queryData));
        await store.set(cacheName, compressedData, {
          metadata: { timestamp: currentTime },
        });
        return new Response(`Data expired; new data saved for "${cacheName}"`, {
          status: 200,
        });
      }
    } else {
      // No existing blob, store fresh.
      const compressedData = await compress(JSON.stringify(queryData));
      await store.set(cacheName, compressedData, {
        metadata: { timestamp: currentTime },
      });
      return new Response(`New data saved for "${cacheName}"`, { status: 200 });
    }
  } catch (error) {
    console.error('Failed to save data in Netlify Blobs:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
