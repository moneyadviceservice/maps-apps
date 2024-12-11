import getConfig from 'next/config';

import { PAGES } from 'CONSTANTS';
import { ParsedUrlQuery } from 'querystring';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

import { getCurrentPath } from '../../utils/getCurrentPath';
import { FLOW } from '../../utils/getQuestions';

export type RecordValue = any;

export type DataFromQuery = Record<string, RecordValue>;

const QUESTION_PREFIX = 'q-';
const CHANGE_ANSWER_PARAM = 'changeAnswer';

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
    cookieData: Record<string, RecordValue>,
    flow: FLOW,
    url: string | undefined,
  ) => string;
  goToResultPage: () => string;
  goToLastQuestion: (data: object, flow: FLOW) => string;
  goToChangeOptionsPage: () => string;
  goToQuestion: (question: number) => string;
}

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
      cookieData: Record<string, RecordValue>,
      flow: FLOW,
      url: string | undefined,
    ) => {
      if (currentStep === 1 && flow === FLOW.START) {
        const backUrl = `/${lang}${path}${addEmbedQuery(isEmbed, '?')}`;
        if (ENVIRONMENT === 'production') {
          return prodLandingPageLink ?? backUrl;
        }
        return backUrl;
      }

      if (url?.includes(PAGES.DEBT_ADVICE_LOCATOR) && flow === FLOW.ONLINE) {
        return `/${lang}/${getCurrentPath(
          FLOW.START,
        )}/${prefix}-4?${convertQueryParamsToString(
          getDataFromQuery(),
        )}${addEmbedQuery(isEmbed, '&')}`;
      }

      if (currentStep === 1 && flow !== FLOW.START) {
        const lastQuestion = Object.keys(storedData)
          .filter((key) => key !== 'error')
          .reduce((acc, curr) => curr, '');

        return `/${lang}/money-adviser-network/${
          FLOW.START
        }/${lastQuestion}?${convertQueryParamsToString(
          getDataFromQuery(),
        )}${addEmbedQuery(isEmbed, '&')}`;
      }
      const previousStep = currentStep - 1;

      if (flow === FLOW.ONLINE || flow === FLOW.TELEPHONE) {
        if (url?.includes(PAGES.CONSENT_REJECTED)) {
          return `/${lang}${path}${prefix}-1?${convertQueryParamsToString(
            getDataFromQuery(),
          )}${addEmbedQuery(isEmbed, '&')}`;
        }
      }

      if (flow === FLOW.TELEPHONE) {
        if (
          (currentStep === 4 &&
            cookieData['consentReferral']?.consentReferralAnswer === '1') ||
          (currentStep === 6 && cookieData['t-4'] === '0')
        ) {
          return `/${lang}${path}${prefix}-${
            previousStep - 1
          }?${convertQueryParamsToString(getDataFromQuery())}${addEmbedQuery(
            isEmbed,
            '&',
          )}`;
        }
      }

      return previousStep > -1
        ? `/${lang}${path}${prefix}-${previousStep}?${convertQueryParamsToString(
            getDataFromQuery(),
          )}${addEmbedQuery(isEmbed, '&')}`
        : `/${lang}${path}${prefix}-${currentStep}?${convertQueryParamsToString(
            getDataFromQuery(),
          )}${addEmbedQuery(isEmbed, '&')}`;
    },
    goToResultPage: () =>
      `/${lang}${path}results?${convertQueryParamsToString(
        getDataFromQuery(),
      )}${addEmbedQuery(isEmbed, '&')}`,
    goToLastQuestion: (data: object, flow: FLOW) => {
      let lastStep;
      if (flow === FLOW.TELEPHONE) {
        lastStep = 7;
      } else if (flow === FLOW.ONLINE) {
        lastStep = 3;
      } else {
        lastStep = Object.keys(data).reduce((a, c) => {
          const val = c.split(QUESTION_PREFIX);
          if (val.length > 1) {
            return a < Number(val[1]) ? Number(val[1]) : a;
          }
          return a;
        }, 0);
      }

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
