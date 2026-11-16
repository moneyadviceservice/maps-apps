import React from 'react';

import { NextApiRequest, NextApiResponse } from 'next';

import { PdfReport } from 'components/PdfReport';
import path from 'path';
import { Font, renderToBuffer } from '@react-pdf/renderer';

const publicDir = path.join(process.cwd(), 'public');

// Registered from the filesystem; the .ttf files are shipped with the
// serverless function via netlify.toml [functions] included_files.
Font.register({
  family: 'Manrope',
  fonts: [
    { src: path.join(publicDir, 'Manrope-Regular.ttf'), fontWeight: 400 },
    { src: path.join(publicDir, 'Manrope-Bold.ttf'), fontWeight: 700 },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end();
    return;
  }

  try {
    const { data, content, groups, language } = req.body;

    const document = React.createElement(PdfReport, {
      data: JSON.parse(data),
      content: JSON.parse(content),
      groups: JSON.parse(groups),
      language,
      logoSrc: path.join(publicDir, 'MH_logo.png'),
    });

    const buffer = await renderToBuffer(document);

    const filename =
      language === 'en' ? 'Money Midlife MOT' : 'MOT Canol Oes Arian';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}.pdf"`,
    );
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF report');
  }
}
