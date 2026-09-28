import type { NextApiRequest, NextApiResponse } from 'next';

import { QUESTION_PREFIX } from 'CONSTANTS';
import { midLifeMotNavigationRules } from 'utils/NavigationRules/navigationRules';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, questionNbr, savedData, isEmbed } = request.body;

  const isEmbedBool = isEmbed === 'true';
  const oldData: Record<string, any> = savedData ? JSON.parse(savedData) : {};

  const mainPath = `/question-${questionNbr}`;

  const navRules = midLifeMotNavigationRules(Number(questionNbr), oldData);

  let data: Record<string, any> = { ...oldData };

  if (!navRules?.CONTINUE) {
    data = {
      ...oldData,
      changeAnswer: QUESTION_PREFIX + questionNbr,
    };
  }
  const queryString = Object.keys(data)
    .map((key) => {
      return `${key}=${encodeURIComponent(data[key])}`;
    })
    .join('&');

  response.redirect(
    302,
    `/${language}${mainPath}?${queryString}${addEmbedQuery(isEmbedBool, '&')}`,
  );
}
