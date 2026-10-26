import { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitData {
  count: number;
  lastReset: number;
}

const rateLimitMap = new Map<string, RateLimitData>();

type Handler = (req: NextApiRequest, res: NextApiResponse) => void;

function getIp(req: NextApiRequest): string {
  return (
    (req.headers['x-forwarded-for'] as string) ??
    req.socket.remoteAddress ??
    'unknown'
  );
}

export function rateLimitMiddleware(handler: Handler, requestsPerMinute = 5) {
  const rateLimitOverride = Number(process.env.NETLIFY_RATE_LIMIT);

  return (req: NextApiRequest, res: NextApiResponse) => {
    const ip = getIp(req);
    const windowMs = 60 * 1000;

    // If an override environment variable is provided, use that instead.
    // Used for end-to-end testing.
    const limit = !Number.isNaN(rateLimitOverride)
      ? rateLimitOverride
      : requestsPerMinute;

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        count: 0,
        lastReset: Date.now(),
      });
    }

    const ipData = rateLimitMap.get(ip);

    if (ipData) {
      if (Date.now() - ipData.lastReset > windowMs) {
        ipData.count = 0;
        ipData.lastReset = Date.now();
      }

      if (ipData.count >= limit) {
        return res.status(429).send('Too Many Requests');
      }

      ipData.count += 1;
    }

    return handler(req, res);
  };
}
