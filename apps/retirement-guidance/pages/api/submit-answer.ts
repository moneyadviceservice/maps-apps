import type { NextApiRequest, NextApiResponse } from 'next';

import { CHANGE_ANSWER_PARAM } from 'lib/constants';
import { ParsedRequest } from 'lib/types';
import {
  buildQueryString,
  buildRedirectUrl,
  cleanData,
  getNextPagePath,
  transformData,
} from 'lib/util';

import { parseBodyQuestions } from '@maps-react/utils/parseBodyQuestions';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { language, question, isEmbed } = request.body;
  const isEmbedBool = isEmbed === 'true';

  const { data, questionNumber, error }: ParsedRequest =
    parseBodyQuestions(request);
  const isAnswerChanged = data[CHANGE_ANSWER_PARAM] === question;
  const cleanedData = cleanData(data);
  const page = getNextPagePath(
    error,
    questionNumber,
    cleanedData,
    isAnswerChanged,
  );
  const transformedData = transformData(cleanedData, error, question);
  const queryString = buildQueryString(transformedData);

  response.redirect(
    302,
    buildRedirectUrl(language, page, queryString, isEmbedBool),
  );
};

export default handler;
