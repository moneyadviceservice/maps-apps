import { NextApiRequest, NextApiResponse } from 'next';
import { generateEmbedCode } from 'utils/generateEmbedCode';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const origin = Array.isArray(req.query.origin)
    ? req.query.origin[0]
    : req.query.origin ?? '';

  const language = Array.isArray(req.query.language)
    ? req.query.language[0]
    : req.query.language ?? '';

  const name = Array.isArray(req.query.name)
    ? req.query.name[0]
    : req.query.name ?? '';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(`<!DOCTYPE html>
<html>
  <head>
    <title>MoneyHelper Embed Test</title>
    <meta name="viewport" content="width=device-width">
  </head>
  <body>
    <h1 style="background: #f1f5f9; padding: 10px">
      Example Company Header
    </h1>
    <div style="border: 1px solid #f1f5f9; padding: 5px;">
      ${generateEmbedCode({
        origin,
        language,
        name,
      })}
    </div>
    <div style="background: #f1f5f9; padding: 10px; font-size: 24px; font-weight: bold;">
      Example Footer
    </div>
  </body>
</html>`);

  res.end();
}
