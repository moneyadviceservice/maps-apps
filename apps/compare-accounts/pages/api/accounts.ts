import type { NextApiRequest, NextApiResponse } from 'next';

import { fetchAccounts } from 'utils/CompareAccounts/fetchAccounts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const baseUrl = process.env.ACCOUNTS_API;
  if (!baseUrl) {
    return res.status(500).json({ error: 'ACCOUNTS_API is not set' });
  }

  try {
    const { data } = await fetchAccounts(baseUrl);

    const cdnTtl = 3 * 60 * 60; // 3 Hours
    res.setHeader(
      'Netlify-CDN-Cache-Control',
      `public, durable, s-maxage=${cdnTtl}, stale-while-revalidate=60`,
    );

    console.log('accounts: serving accounts', {
      count: data.items.length,
      lastModified: data.lastModified,
      cdnTtl,
    });

    return res.status(200).json(data);
  } catch (err) {
    console.error('accounts handler failed:', err);
    return res.status(502).json({ error: 'Failed to fetch accounts' });
  }
}
