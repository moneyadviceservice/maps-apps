import type { NextApiRequest, NextApiResponse } from 'next';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { getNextPage } from './getNextPage/getNextPage';
import { navigationRules, transformData } from './transformers/transformData';

type ParsedRequest = {
  data: DataFromQuery;
  questionNumber: number;
  error: boolean;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, question, isEmbed } = request.body;

  const isEmbedBool = isEmbed === 'true';

  const { data, questionNumber, error }: ParsedRequest =
    parseBodyQuestions(request);

  delete data['error'];

  const navRules = navigationRules(questionNumber, data);
  const page = getNextPage(error, questionNumber, navRules);
  const transformedData = transformData(error, data, question);

  const queryString = Object.keys(transformedData as Record<string, string>)
    .map((key) => {
      return `${key}=${encodeURIComponent(
        transformedData && key ? transformedData[key] : '',
      )}`;
    })
    .join('&');

  response.redirect(
    302,
    `/${language}/${page}?${queryString}${addEmbedQuery(isEmbedBool, '&')}`,
  );
}

function parseBodyQuestions(response: NextApiRequest) {
  const { question, answer, savedData } = response.body;
  const questionNumber = Number(question?.split('-')[1]);

  let error = false;
  let data = {};

  if (answer) {
    data = {
      ...(savedData && JSON.parse(savedData)),
      [question]: answer,
    };
  } else {
    data = {
      ...(savedData && JSON.parse(savedData)),
      [question]: answer,
    };
    error = true;
  }

  return { data, questionNumber, error };
}
