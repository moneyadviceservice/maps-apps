import { NextApiRequest, NextApiResponse } from 'next';
import absoluteUrl from 'next-absolute-url';

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

export default function embedHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { origin } = absoluteUrl(req);
  res.setHeader('Content-Type', 'text/javascript');
  res.status(200).send(code(origin));
}
