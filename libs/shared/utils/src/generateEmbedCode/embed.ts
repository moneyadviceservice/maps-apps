import { NextApiRequest, NextApiResponse } from 'next';

import { IncomingMessage } from 'node:http';

const code = (origin: string) => {
  return `
document.addEventListener("DOMContentLoaded", function() {

    const script = document.createElement('script');
    script.async = true;
    script.src = "${origin}/iframeResizer.js"
    
    script.addEventListener('load', function() {
      iFrameResize({ log: true }, '.mas-iframe-container .mas-iframe')

      const containers = document.querySelectorAll('.mas-iframe-container');
      for (let i = 0; i < containers.length; i++) {
        containers[i].removeAttribute("style");
      }

      const frames = document.querySelectorAll('.mas-iframe');
      for (let i = 0; i < frames.length; i++) {
        frames[i].setAttribute("style", "width: 1px; min-width: 100%; border: 0");
      }
    });

    document.body.appendChild(script);
});
`;
};

const VALID_PROTOCOLS = new Set(['http:', 'https:']);

function absoluteUrl(
  req: IncomingMessage,
  localhostAddress = 'localhost:3000',
): string {
  let host = req.headers.host || localhostAddress;
  let protocol = host.startsWith('localhost') ? 'http:' : 'https:';

  if (
    req.headers['x-forwarded-host'] &&
    typeof req.headers['x-forwarded-host'] === 'string'
  ) {
    host = req.headers['x-forwarded-host'].split(',')[0].trim();
  }

  if (
    req.headers['x-forwarded-proto'] &&
    typeof req.headers['x-forwarded-proto'] === 'string'
  ) {
    protocol = `${req.headers['x-forwarded-proto'].split(',')[0].trim()}:`;
  }

  if (!VALID_PROTOCOLS.has(protocol)) {
    protocol = 'https:';
  }

  const origin = protocol + '//' + host;

  try {
    new URL(origin);
  } catch {
    return `https://${localhostAddress}`;
  }

  return origin;
}

export default function embedHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const origin = absoluteUrl(req);
  res.setHeader('Content-Type', 'text/javascript');
  res.status(200).send(code(origin));
}
