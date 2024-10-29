import type { NextApiRequest, NextApiResponse } from 'next';
import { getNextPage } from './utils/getNextPage';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

interface RequestBody {
  language: string;
  question: string;
  isEmbed: string;
}

type ParsedRequest = {
  data: DataFromQuery;
  questionNumber: number;
  error: boolean;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, question, isEmbed }: RequestBody = request.body;

  const isEmbedBool = isEmbed === 'true';

  const { data, questionNumber, error }: ParsedRequest =
    parseBodyQuestions(request);

  delete data['error'];

  const page = getNextPage(error, questionNumber, data);

  const transformedData: DataFromQuery = {
    ...data,
    ...(error && { error: question }),
  };

  const queryString = Object.keys(transformedData as Record<string, string>)
    .map((key) => {
      return `${key}=${encodeURIComponent(
        transformedData && key ? transformedData[key] : '',
      )}`;
    })
    .join('&');

  const urlQueries = `${queryString}${addEmbedQuery(isEmbedBool, '&')}`;

  response.redirect(302, `/${language}${page}?${urlQueries}`);
}

function parseBodyQuestions(response: NextApiRequest) {
  const { question, type, answer, savedData } = response.body;
  const questionNumber = Number(question?.split('-')[1]);

  let error = false;
  let data = { ...(savedData && JSON.parse(savedData)) };

  switch (type) {
    case 'single':
      if (answer) {
        data = {
          ...data,
          [question]: answer,
        };
      } else {
        error = true;
      }
      break;

    case 'multiple':
      ({ data, error } = parseBodyMultiQuestions(response, data));
      break;

    case 'moneyInput':
      if (answer) {
        data = {
          ...data,
          [question]: `£${answer.replace(/,/g, '')}`,
        };
      } else {
        error = true;
      }
      break;

    default:
      error = true;
  }

  return { data, questionNumber, error };
}

function parseBodyMultiQuestions(
  response: NextApiRequest,
  data: Record<string, string | number>,
) {
  const { question, clearAll } = response.body;
  const questionNumber = Number(question?.split('-')[1]);
  let error = false;
  let an = '';

  Object.keys(response.body).forEach((t) => {
    if (t.indexOf('answer') > -1) {
      const answers =
        an.length > 0
          ? ',' + String(response.body[t])
          : String(response.body[t]);

      an =
        clearAll[response.body[t]] === 'true'
          ? response.body[t]
          : an.concat(answers);
    }
  });

  if (an.length > 0) {
    data = {
      ...data,
      [question]: an,
    };
  } else {
    error = true;
  }

  return {
    data,
    questionNumber,
    error,
  };
}
