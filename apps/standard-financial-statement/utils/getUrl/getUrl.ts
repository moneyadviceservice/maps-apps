import { IncomingMessage } from 'http';

export const getUrl = (req: IncomingMessage) => {
  const protocol = req.headers?.referer?.startsWith('https') ? 'https' : 'http';
  return encodeURI(
    protocol.concat('://', req.headers?.host ?? '', req?.url ?? ''),
  );
};
