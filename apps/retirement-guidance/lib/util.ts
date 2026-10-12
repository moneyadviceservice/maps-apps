import {
  CHECK_ANSWERS_PAGE,
  PAGE_PATH_PREFIX,
  QUESTION_PREFIX,
} from 'lib/constants';
import { ParsedUrlQuery } from 'node:querystring';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

export const getSingleQueryParam = (
  value: ParsedUrlQuery[string],
): string | undefined => {
  return typeof value === 'string' ? value : undefined;
};

const getAnswerForQuestion = (data: Record<string, string>, qNumber: number) =>
  Number(data[`${QUESTION_PREFIX}${qNumber}`] ?? Number.NaN);

export const getNextPagePath = (
  error: boolean,
  questionNumber: number,
  data: Record<string, string>,
  isAnswerChanged: boolean,
): string => {
  const answerQ10 = getAnswerForQuestion(data, 10);

  if (error) return `${PAGE_PATH_PREFIX}${questionNumber}`;

  const isQ10 = questionNumber === 10;
  const isQ11 = questionNumber === 11;
  const isQ10Answer0 = isQ10 && answerQ10 === 0;
  const isQ10Answer1 = isQ10 && answerQ10 === 1;

  if (isQ10Answer0) return `${PAGE_PATH_PREFIX}${questionNumber + 1}`;
  if (isQ10Answer1 || isQ11 || isAnswerChanged) return CHECK_ANSWERS_PAGE;

  return `${PAGE_PATH_PREFIX}${questionNumber + 1}`;
};

const generatePagePath = (language: string, page: string) =>
  `/${language}${page}`;

export const buildRedirectUrl = (
  language: string,
  page: string,
  queryString: string,
  isEmbedBool: boolean,
) => {
  const basePath = generatePagePath(language, page);
  return `${basePath}?${queryString}${addEmbedQuery(isEmbedBool, '&')}`;
};

export const transformData = (
  data: Record<string, string>,
  error: boolean,
  question: string,
): Record<string, string> => {
  let result = { ...data };
  if (getAnswerForQuestion(result, 10) === 1) {
    const { ['q-11']: _, ...rest } = result;
    result = rest;
  }
  if (error) {
    result = { ...result, error: question };
  }
  return result;
};

export const buildQueryString = (data: Record<string, string>): string =>
  Object.keys(data)
    .map((key) => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

export const cleanData = (data: Record<string, string>) => {
  const { error, changeAnswer, ...rest } = data;
  return rest;
};

export const parseOldData = (
  savedData: string | undefined,
): Record<string, string> => {
  if (!savedData) return {};
  try {
    return JSON.parse(savedData);
  } catch {
    return {};
  }
};

export const buildData = (
  navRules: boolean,
  oldData: Record<string, string>,
  questionNbr: string,
): Record<string, string> => {
  if (!navRules) {
    return {
      ...oldData,
      changeAnswer: QUESTION_PREFIX + questionNbr,
    };
  }
  return { ...oldData };
};

export const checkAnswersNavRules = (
  question: number,
  data: Record<string, string>,
): boolean => question === 10 && getAnswerForQuestion(data, 10) === 0;
