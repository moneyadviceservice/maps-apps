import type { NextApiRequest, NextApiResponse } from 'next';

import { DataFromQuery } from '@maps-react/utils/pageFilter';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, questionNbr, pagePath, prefix, urlData } = request.body;

  const parsedUrlData: DataFromQuery = {
    ...(urlData ? JSON.parse(urlData) : {}),
    changeAnswer: `${prefix}${questionNbr}`,
  };

  const queryString = Object.keys(parsedUrlData)
    .map((key) => {
      return `${key}=${encodeURIComponent(parsedUrlData[key])}`;
    })
    .join('&');

  response.redirect(302, `/${language}/${pagePath}?${queryString}`);
}
