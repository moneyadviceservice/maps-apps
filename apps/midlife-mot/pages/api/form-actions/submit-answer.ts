import type { NextApiRequest, NextApiResponse } from 'next';

import { CHANGE_ANSWER_PARAM, DATA_PATH } from 'CONSTANTS';
import { midLifeMotNavigationRules } from 'utils/NavigationRules/navigationRules';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { parseBodyQuestions } from '@maps-react/utils/parseBodyQuestions';

import { getNextPage } from './getNextPage';
import { transformData } from './transformers';

type ParsedRequest = {
  data: DataFromQuery;
  questionNumber: number;
  error: boolean;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, target, question, isEmbed } = request.body;

  const isEmbedBool = isEmbed === 'true';
  const mainPath = `/${DATA_PATH}/`;

  const { data, questionNumber, error }: ParsedRequest =
    parseBodyQuestions(request);
  const isAnswerChanged: boolean = data[CHANGE_ANSWER_PARAM] === question;

  delete data['error'];
  delete data['changeAnswer'];

  const navRules = midLifeMotNavigationRules(questionNumber, data);
  const page = getNextPage(
    error,
    questionNumber,
    navRules,
    isAnswerChanged,
    target,
  );
  const mainPathWithoutLeadingSlash = mainPath?.endsWith('/')
    ? mainPath?.slice(0, -1)
    : mainPath;

  const transformedData = transformData(error, navRules, data, question);

  const queryString = Object.keys(transformedData as Record<string, string>)
    .map((key) => {
      return `${key}=${encodeURIComponent(
        transformedData && key ? transformedData[key] : '',
      )}`;
    })
    .join('&');

  response.redirect(
    302,
    `/${language}${mainPathWithoutLeadingSlash}${page}?${queryString}${addEmbedQuery(
      isEmbedBool,
      '&',
    )}`,
  );
}
