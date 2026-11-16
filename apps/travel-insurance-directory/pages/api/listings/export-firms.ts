import React from 'react';

import type { NextApiRequest, NextApiResponse } from 'next';

import { ExportPDF, firmToExportRow } from 'components/ExportPDF';
import { exportCopy } from 'data/pages/listings/export';
import { getAllFilteredFirms } from 'lib/firms/getFirmsPaginated';
import type { QueryParams } from 'utils/query/queryHelpers';
import { renderToBuffer } from '@react-pdf/renderer';

const ALLOWED_LANGS = new Set(['en', 'cy']);
const DEFAULT_LANG = 'en';

function getLang(query: QueryParams): 'en' | 'cy' {
  const raw = query.lang;
  let s = '';
  if (typeof raw === 'string') s = raw.trim().toLowerCase();
  else if (Array.isArray(raw)) s = raw[0]?.trim().toLowerCase() ?? '';
  return ALLOWED_LANGS.has(s as 'en' | 'cy')
    ? (s as 'en' | 'cy')
    : DEFAULT_LANG;
}

/**
 * GET: returns a PDF of all firms matching the current filter.
 * Query params: same as listings page (filters); optional lang (en|cy) for PDF headers.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).end();
    return;
  }

  const query = (req.query || {}) as QueryParams;
  const lang = getLang(query);

  try {
    const firms = await getAllFilteredFirms(query);
    const rows = firms.map(firmToExportRow);
    const title = exportCopy.pdfTitle[lang];
    const columnHeaders = exportCopy.columnHeaders[lang];

    const document = React.createElement(ExportPDF, {
      title,
      columnHeaders,
      rows,
    });
    const buffer = await renderToBuffer(document);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="travel-insurance-firms.pdf"',
    );
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (err) {
    console.error('Export firms PDF failed:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
