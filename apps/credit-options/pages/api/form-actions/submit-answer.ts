import type { NextApiRequest, NextApiResponse } from 'next';

import { CHANGE_ANSWER_PARAM } from 'CONSTANTS';

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

  const { data, questionNumber, error }: ParsedRequest =
    parseBodyQuestions(request);

  const parsedSavedData = JSON.parse(request.body.savedData ?? '{}');

  const isAnswerChanged = parsedSavedData[CHANGE_ANSWER_PARAM] === question;

  const mergedData = {
    ...parsedSavedData,
    ...data,
  };

  delete mergedData['error'];
  delete mergedData['changeAnswer'];

  const page = error
    ? `/question-${questionNumber}`
    : getNextPage(questionNumber, isAnswerChanged, target);

  const transformedData = transformData(error, mergedData, question);

  const queryString = Object.keys(transformedData as Record<string, string>)
    .map((key) => {
      return `${key}=${encodeURIComponent(
        transformedData && key ? transformedData[key] : '',
      )}`;
    })
    .join('&');

  response.redirect(
    302,
    `/${language}${page}?${queryString}${addEmbedQuery(isEmbedBool, '&')}`,
  );
}
