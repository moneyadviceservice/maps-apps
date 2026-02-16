import getConfig from 'next/config';

import { ParsedUrlQuery } from 'querystring';

import { addEmbedQuery } from '../addEmbedQuery';

export type RecordValue = any;

export type DataFromQuery = Record<string, RecordValue>;

export interface PageFilterFunctions {
  getDataFromQuery: () => DataFromQuery;
  convertQueryParamsToString: (
    p: Record<string, RecordValue>,
  ) => URLSearchParams;
  goToStep: (step: string) => string;
  goToFirstStep: () => string;
  backStep: (
    currentStep: number,
    storedData: Record<string, RecordValue>,
  ) => string;
  goToSummaryPage: () => string;
  goToResultPage: () => string;
  goToLastQuestion: (data: object) => string;
  goToChangeOptionsPage: () => string;
  goToQuestion: (question: number) => string;
}

const QUESTION_PREFIX = 'q-';
const CHANGE_ANSWER_PARAM = 'changeAnswer';

export const pageFilter = (
  query: ParsedUrlQuery,
  path: string,
  isEmbed: boolean,
  prodLandingPageLink?: string,
  pagePrefix?: string,
): PageFilterFunctions => {
  const {
    publicRuntimeConfig: { ENVIRONMENT },
  } = getConfig();

  const lang = query?.language;
  const prefix = pagePrefix ?? 'question';

  const getDataFromQuery = () => {
    const data: DataFromQuery = {};
    Object.keys(query).forEach((g) => {
      if (
        g.indexOf(QUESTION_PREFIX) > -1 ||
        g.indexOf(CHANGE_ANSWER_PARAM) > -1 ||
        g.indexOf('error') > -1
      ) {
        data[g] = query[g];
      }
    });

    return data;
  };

  const convertQueryParamsToString = (
    p: Record<string, RecordValue>,
  ): URLSearchParams => {
    return new URLSearchParams(p as Record<string, string>);
  };

  return {
    getDataFromQuery,
    convertQueryParamsToString,
    goToStep: (step: string) =>
      `/${lang}${path}${step}?${convertQueryParamsToString(
        getDataFromQuery(),
      )}${addEmbedQuery(isEmbed, '&')}`,
    goToFirstStep: () =>
      `/${lang}${path}${prefix}-1?restart=true${addEmbedQuery(isEmbed, '&')}`,
    backStep: (
      currentStep: number,
      storedData: Record<string, RecordValue>,
    ) => {
      if (currentStep === 1) {
        const backUrl = `/${lang}${path}${addEmbedQuery(isEmbed, '?')}`;
        if (ENVIRONMENT === 'production') {
          return prodLandingPageLink ?? backUrl;
        }
        return backUrl;
      }

      let previousStep = currentStep - 1;
      let hasPreviousStep =
        Object.keys(storedData).indexOf(
          `${QUESTION_PREFIX}${currentStep - 1}`,
        ) > -1;

      while (previousStep > 1 && !hasPreviousStep) {
        previousStep--;
        hasPreviousStep =
          Object.keys(storedData).indexOf(`${QUESTION_PREFIX}${previousStep}`) >
          -1;
      }

      return previousStep > -1
        ? `/${lang}${path}${prefix}-${previousStep}?${convertQueryParamsToString(
            getDataFromQuery(),
          )}${addEmbedQuery(isEmbed, '&')}`
        : `/${lang}${path}${prefix}-${currentStep}?${convertQueryParamsToString(
            getDataFromQuery(),
          )}${addEmbedQuery(isEmbed, '&')}`;
    },
    goToSummaryPage: () =>
      `/${lang}${path}summary?${convertQueryParamsToString(
        getDataFromQuery(),
      )}`,
    goToResultPage: () =>
      `/${lang}${path}results?${convertQueryParamsToString(
        getDataFromQuery(),
      )}${addEmbedQuery(isEmbed, '&')}`,
    goToLastQuestion: (data: object) => {
      const lastStep = Object.keys(data).reduce((a, c) => {
        const val = c.split(QUESTION_PREFIX);
        if (val.length > 1) {
          return a < Number(val[1]) ? Number(val[1]) : a;
        }
        return a;
      }, 0);

      return `/${lang}${path}${prefix}-${lastStep}?${convertQueryParamsToString(
        getDataFromQuery(),
      )}${addEmbedQuery(isEmbed, '&')}`;
    },
    goToChangeOptionsPage: () =>
      `/${lang}${path}change-options?${convertQueryParamsToString(
        getDataFromQuery(),
      )}${addEmbedQuery(isEmbed, '&')}`,
    goToQuestion: (question: number) => {
      return `/${lang}${path}${prefix}-${question}?${convertQueryParamsToString(
        getDataFromQuery(),
      )}${addEmbedQuery(isEmbed, '&')}`;
    },
  };
};
