import type { NextApiRequest, NextApiResponse } from 'next';

import { QUESTION_PREFIX } from 'CONSTANTS';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, questionNbr, savedData, isEmbed } = request.body;

  const isEmbedBool = isEmbed === 'true';
  const oldData: Record<string, any> = savedData ? JSON.parse(savedData) : {};
  const mainPath = `/question-${questionNbr}`;

  const data: Record<string, any> = {
    ...oldData,
    changeAnswer: `${QUESTION_PREFIX}${questionNbr}`,
  };

  const queryString = Object.keys(data)
    .map((key) => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

  response.redirect(
    302,
    `/${language}${mainPath}?${queryString}${addEmbedQuery(isEmbedBool, '&')}`,
  );
}
