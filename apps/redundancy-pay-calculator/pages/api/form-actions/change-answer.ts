import type { NextApiRequest, NextApiResponse } from 'next';

import { DATA_PATH, QUESTION_PREFIX } from 'CONSTANTS';
import { navigationRules } from 'utils/NavigationRules';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const { language, questionNbr, savedData, isEmbed } = request.body;

    const isEmbedBool = isEmbed === 'true';
    const questionNumber = Number(questionNbr);
    const oldData = savedData ? JSON.parse(savedData) : {};
    const searchParams = new URLSearchParams();

    const navRules = navigationRules(questionNumber, oldData);

    const data = !navRules?.CONTINUE
      ? { ...oldData, changeAnswer: `${QUESTION_PREFIX}${questionNbr}` }
      : oldData;

    Object.entries(data).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    const basePath = `/${language}/${DATA_PATH}/question-${questionNbr}`;
    const queryString = searchParams.toString();
    const embedSuffix = addEmbedQuery(isEmbedBool, '&');

    response.redirect(303, `${basePath}?${queryString}${embedSuffix}`);
  } catch (error) {
    console.error('Error in change-answer API:', error);
    response.status(500).json({ error: 'Error in change-answer API' });
  }
}
