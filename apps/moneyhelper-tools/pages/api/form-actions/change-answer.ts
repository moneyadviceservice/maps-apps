import type { NextApiRequest, NextApiResponse } from 'next';

import { QUESTION_PREFIX } from 'CONSTANTS';
import { getToolPath } from 'utils/getToolPath';
import { navigationRules } from 'utils/NavigationRules';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, questionNbr, savedData, dataPath, isEmbed } = request.body;

  const isEmbedBool = isEmbed === 'true';
  const oldData: Record<string, any> = savedData ? JSON.parse(savedData) : {};
  const toolPath = getToolPath(dataPath);
  const mainPath = `/${toolPath}/question-${questionNbr}`;
  const navRules = navigationRules(Number(questionNbr), oldData, dataPath);

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
