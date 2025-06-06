import type { NextApiRequest, NextApiResponse } from 'next';

import { DATA_PATH, QUESTION_PREFIX } from 'CONSTANTS';
import { navigationRules } from 'utils/NavigationRules';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, questionNbr, savedData, isEmbed } = request.body;

  const isEmbedBool = isEmbed === 'true';
  const oldData: Record<string, any> = savedData ? JSON.parse(savedData) : {};
  const toolPath = `/${DATA_PATH}/`;
  const mainPath = `/${toolPath}/question-${questionNbr}`;
  const navRules = navigationRules(Number(questionNbr), oldData);

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
