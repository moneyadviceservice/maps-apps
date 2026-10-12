import type { NextApiRequest, NextApiResponse } from 'next';

import { parseListingsRequestBody } from 'utils/formHelpers';
import { buildListingsSearchParams } from 'utils/listingsPageFilters';

const ALLOWED_LANGS = new Set(['en', 'cy']);

function getLang(body: Record<string, unknown>): 'en' | 'cy' {
  const lang = body.lang;
  const s = typeof lang === 'string' ? lang.trim().toLowerCase() : '';
  return ALLOWED_LANGS.has(s as 'en' | 'cy') ? (s as 'en' | 'cy') : 'en';
}

/**
 * POST: parse form body, validate lang, redirect to /[lang]/listings?...
 * Used when JS is disabled (form submit) so results update after "Apply filters".
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end();
    return;
  }

  const body = (req.body || {}) as Record<
    string,
    string | string[] | undefined
  >;
  const parsed = parseListingsRequestBody(body);
  const lang = getLang(parsed as Record<string, unknown>);
  const searchParams = buildListingsSearchParams(parsed);
  const search = searchParams.toString();
  const query = search ? `?${search}` : '';
  const url = `/${lang}/listings${query}`;
  res.redirect(303, url);
}
