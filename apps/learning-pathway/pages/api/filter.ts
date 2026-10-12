import { NextApiRequest, NextApiResponse } from 'next';

const addFiltersToParams = (
  query: Record<string, string | string[] | undefined>,
) => {
  return Object.entries(query).reduce((acc, [key, value]) => {
    if (!key || !value) return acc;

    return {
      ...acc,
      [key]: Array.isArray(value) ? value.join(',') : value,
    };
  }, {});
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const ALLOWED_METHODS = ['POST', 'GET'];
  if (
    !ALLOWED_METHODS.includes(
      request.method as (typeof ALLOWED_METHODS)[number],
    )
  ) {
    return response.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ALLOWED_METHODS,
    });
  }
  const { query } = request;

  const { lang, ...rest } = query;
  delete rest['keyword-current'];
  const params = addFiltersToParams(rest);

  response.redirect(
    `/${lang}/learning-pathway?${new URLSearchParams(params).toString()}`,
  );
}
