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
  return (req: NextApiRequest, res: NextApiResponse) => {
    const ip = getIp(req);
    const limit = requestsPerMinute;
    const windowMs = 60 * 1000;

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
