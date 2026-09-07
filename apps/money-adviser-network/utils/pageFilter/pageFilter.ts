import { ParsedUrlQuery } from 'querystring';

import { PAGES } from '../../CONSTANTS';
import { FORM_FIELDS } from '../../data/questions/types';
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
  pagePrefix?: string,
): PageFilterFunctions => {
  const lang = query?.language;
  const prefix = pagePrefix ?? 'question';

  const getDataFromQuery = () => {
    const data: DataFromQuery = {};
    Object.keys(query).forEach((g) => {
      if (
        g.indexOf(QUESTION_PREFIX) > -1 ||
        g.indexOf(CHANGE_ANSWER_PARAM) > -1 ||
        g.indexOf('error') > -1 ||
        g.indexOf('test') > -1
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

  const returnToStartFour = (flow: FLOW, url?: string) =>
    (url?.includes(PAGES.DEBT_ADVICE_LOCATOR) && flow === FLOW.ONLINE) ||
    (url?.includes(PAGES.DEBT_ADVICE_LOCATOR) && flow === FLOW.FACE);

  return {
    getDataFromQuery,
    convertQueryParamsToString,
    goToStep: (step: string) =>
      `/${lang}${path}${step}?${convertQueryParamsToString(
        getDataFromQuery(),
      )}`,
    goToFirstStep: () => `/${lang}${path}${prefix}-1?restart=true`,
    backStep: (
      currentStep: number,
      storedData: Record<string, RecordValue>,
      cookieData: Record<string, RecordValue>,
      flow: FLOW,
      url: string | undefined,
    ) => {
      const queryParams = convertQueryParamsToString(getDataFromQuery());

      const buildUrl = (step: number) =>
        `/${lang}${path}${prefix}-${step}?${queryParams}`;

      if (currentStep === 1) {
        if (flow === FLOW.START) {
          return '';
        } else {
          const lastQuestion = Object.keys(storedData)
            .filter((key) => key !== 'error')
            .reduce((acc, curr) => curr, '');

          return `/${lang}/${getCurrentPath(
            FLOW.START,
          )}/${lastQuestion}?${queryParams}`;
        }
      }

      if (returnToStartFour(flow, url)) {
        return `/${lang}/${getCurrentPath(
          FLOW.START,
        )}/${prefix}-4?${queryParams}`;
      }

      if (flow === FLOW.ONLINE || flow === FLOW.TELEPHONE) {
        if (url?.includes(PAGES.CONSENT_REJECTED)) {
          return buildUrl(1);
        }
      }

      if (flow === FLOW.TELEPHONE) {
        if (
          (currentStep === 4 &&
            cookieData[FORM_FIELDS.consentReferral]?.value === '1') ||
          (currentStep === 6 &&
            cookieData[FORM_FIELDS.whenToSpeak]?.value === '0')
        ) {
          return buildUrl(currentStep - 2);
        }
      }

      const previousStep = currentStep - 1;
      return buildUrl(previousStep > -1 ? previousStep : currentStep);
    },
    goToResultPage: () =>
      `/${lang}${path}results?${convertQueryParamsToString(
        getDataFromQuery(),
      )}`,
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
      )}`;
    },
    goToChangeOptionsPage: () =>
      `/${lang}${path}change-options?${convertQueryParamsToString(
        getDataFromQuery(),
      )}`,
    goToQuestion: (question: number) => {
      return `/${lang}${path}${prefix}-${question}?${convertQueryParamsToString(
        getDataFromQuery(),
      )}`;
    },
  };
};
