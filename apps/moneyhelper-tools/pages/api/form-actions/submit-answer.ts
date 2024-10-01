import { CHANGE_ANSWER_PARAM, SCORE_PREFIX } from 'CONSTANTS';
import type { NextApiRequest, NextApiResponse } from 'next';
import { navigationRules } from 'utils/NavigationRules';
import { getNextPage } from './getNextPage';
import { transformData } from './transformers';
import { getToolPath } from 'utils/getToolPath';
import { addEmbedQuery } from 'utils/addEmbedQuery';
import { DataFromQuery } from 'utils/pageFilter';

type ParsedRequest = {
  data: DataFromQuery;
  questionNumber: number;
  error: boolean;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, target, question, dataPath, isEmbed } = request.body;

  const isEmbedBool = isEmbed === 'true';
  const mainPath = getToolPath(dataPath);

  const { data, questionNumber, error }: ParsedRequest =
    parseBodyQuestions(request);
  const isAnswerChanged: boolean = data[CHANGE_ANSWER_PARAM] === question;

  delete data['error'];
  delete data['changeAnswer'];

  const navRules = navigationRules(questionNumber, data, dataPath);
  const page = getNextPage(
    error,
    dataPath,
    questionNumber,
    navRules,
    isAnswerChanged,
    target,
  );

  const transformedData = transformData(
    error,
    navRules,
    data,
    question,
    dataPath,
  );

  const queryString = Object.keys(transformedData as Record<string, string>)
    .map((key) => {
      return `${key}=${encodeURIComponent(
        transformedData && key ? transformedData[key] : '',
      )}`;
    })
    .join('&');

  response.redirect(
    302,
    `/${language}${mainPath}${page}?${queryString}${addEmbedQuery(
      isEmbedBool,
      '&',
    )}`,
  );
}

function parseBodyQuestions(response: NextApiRequest) {
  const { score, question, type, answer, savedData } = response.body;
  const questionNumber = Number(question?.split('-')[1]);
  const questionScore = SCORE_PREFIX + questionNumber;

  let error = false;
  let data = {};

  switch (type) {
    case 'single':
      if (answer) {
        data = {
          ...(savedData && JSON.parse(savedData)),
          [question]: answer,
          ...(score && { [questionScore]: score[Number(answer)] }),
        };
      } else {
        error = true;
      }
      break;

    case 'multiple':
      ({ data, error } = parseBodyMultiQuestions(
        response,
        savedData ? JSON.parse(savedData) : {},
      ));
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
  const { score, unselectedScore, question, clearAll } = response.body;
  const questionNumber = Number(question?.split('-')[1]);
  const questionScore = SCORE_PREFIX + questionNumber;
  let error = false;
  let an = '';
  let totalScore = 0;

  Object.keys(response.body).map((t) => {
    if (t.indexOf('answer') > -1) {
      if (score) {
        const sc = Number(score[response.body[t]]);

        totalScore = totalScore === 0 || totalScore > sc ? sc : totalScore;
      }

      const answers =
        an.length > 0
          ? ',' + String(response.body[t])
          : String(response.body[t]);

      an =
        clearAll[response.body[t]] === 'true'
          ? response.body[t]
          : an.concat(answers);

      delete unselectedScore[response.body[t]];
    }
  });

  if (an.length > 0) {
    if (totalScore > 1) {
      unselectedScore.forEach((element: string | string[]) => {
        const s = element.length > 0 ? Number(element) : null;
        const sc = s && s < totalScore ? s : totalScore;
        totalScore = s ? sc : totalScore;
      });
    }

    data = {
      ...data,
      [question]: an,
      ...(score && { [questionScore]: Math.max(totalScore, 0) }),
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
