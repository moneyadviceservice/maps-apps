import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { PAGES, PATHS } from '../../../../CONSTANTS';
import { FORM_FIELDS, FORM_GROUPS } from '../../../../data/questions/types';
import { getCurrentPath } from '../../../../utils/getCurrentPath';
import { getPrefix } from '../../../../utils/getPrefix';
import { FLOW } from '../../../../utils/getQuestions';
import { questionMapper } from '../../../../utils/questionMapper';

const nextPage = ({ path, page }: { path: string; page: string }) =>
  `/${path}/${page}`;

export const getNextPage = (
  error: boolean,
  questionNumber: number,
  data: DataFromQuery,
  cookieData: DataFromQuery,
  currentFlow?: FLOW,
  isChangeAnswer?: boolean,
  prevData?: DataFromQuery,
) => {
  const prefix = getPrefix(currentFlow ?? FLOW.START);

  const nextPageObj = {
    path: getCurrentPath(currentFlow),
    page: `${prefix}${questionNumber + 1}`,
  };

  if (error) {
    return nextPage({ ...nextPageObj, page: `${prefix}${questionNumber}` });
  }

  if (currentFlow === FLOW.TELEPHONE) {
    return getNextTelephoneFlowPage(
      questionNumber,
      cookieData,
      prefix,
      isChangeAnswer,
    );
  }

  if (currentFlow === FLOW.ONLINE) {
    return getNextOnlineFlowPage(questionNumber, cookieData, prefix);
  }

  const currentAnswer = data[`${prefix}${questionNumber}`];

  switch (questionNumber) {
    case 1: {
      if (currentAnswer === '0') {
        return nextPage({ ...nextPageObj, page: PAGES.MONEY_MANAGEMENT_REFER });
      }
      break;
    }
    case 2: {
      if (currentAnswer !== '0') {
        return nextPage({ ...nextPageObj, page: PAGES.DEBT_ADVICE_LOCATOR });
      }
      break;
    }
    case 3: {
      if (currentAnswer === '0') {
        return nextPage({
          ...nextPageObj,
          page: PAGES.BUSINESS_DEBTLINE_REFER,
        });
      }
      break;
    }
    case 4: {
      const isAnswerTheSame =
        prevData && prevData[`${prefix}${questionNumber}`] === currentAnswer;

      if (currentAnswer === '0') {
        if (isChangeAnswer && isAnswerTheSame) {
          return nextPage({
            path: PATHS.ONLINE,
            page: PAGES.CONFIRM_ANSWERS,
          });
        }

        return nextPage({ path: PATHS.ONLINE, page: `o-1` });
      } else if (currentAnswer === '1') {
        if (isChangeAnswer && isAnswerTheSame) {
          return nextPage({
            path: PATHS.TELEPHONE,
            page: PAGES.CONFIRM_ANSWERS,
          });
        }

        return nextPage({ path: PATHS.TELEPHONE, page: `t-1` });
      } else if (currentAnswer === '2') {
        return nextPage({
          path: getCurrentPath(FLOW.ONLINE),
          page: PAGES.DEBT_ADVICE_LOCATOR,
        });
      }
      break;
    }
  }

  const nextQuestionHasAnswer = !!data[`${prefix}${questionNumber + 1}`];
  if (isChangeAnswer && nextQuestionHasAnswer) {
    return nextPage({ ...nextPageObj, page: PAGES.CONFIRM_ANSWERS });
  }

  return nextPage(nextPageObj);
};

const getNextTelephoneFlowPage = (
  questionNumber: number,
  cookieData: DataFromQuery,
  prefix: string,
  isChangeAnswer?: boolean,
) => {
  const nextPageObj = {
    path: getCurrentPath(FLOW.TELEPHONE),
    page: `${prefix}${questionNumber + 1}`,
  };

  switch (questionNumber) {
    case 1: {
      const currentAnswer = cookieData[FORM_FIELDS.consentDetails]?.value;
      if (currentAnswer === '1') {
        const doesNextPageAnswerExist =
          !!cookieData[FORM_FIELDS.consentReferral]?.value;

        if (isChangeAnswer && doesNextPageAnswerExist) {
          return nextPage({ ...nextPageObj, page: PAGES.CONFIRM_ANSWERS });
        }

        return nextPage({ ...nextPageObj, page: PAGES.CONSENT_REJECTED });
      }
      break;
    }
    case 2: {
      const currentAnswer = cookieData[FORM_FIELDS.consentReferral]?.value;
      if (currentAnswer === '1') {
        const doesNextPageAnswerExist = !!cookieData[FORM_FIELDS.whenToSpeak];
        if (isChangeAnswer && doesNextPageAnswerExist) {
          return nextPage({ ...nextPageObj, page: PAGES.CONFIRM_ANSWERS });
        }

        return nextPage({ ...nextPageObj, page: `${prefix}4` });
      }
      break;
    }
    case 4: {
      const currentAnswer = cookieData[FORM_FIELDS.whenToSpeak];

      if (currentAnswer === '0') {
        const doesNextPageAnswersExist =
          !!cookieData[FORM_GROUPS.customerDetails];
        if (isChangeAnswer && doesNextPageAnswersExist) {
          return nextPage({ ...nextPageObj, page: PAGES.CONFIRM_ANSWERS });
        }
        return nextPage({ ...nextPageObj, page: `${prefix}6` });
      }
      break;
    }
    case 7: {
      return nextPage({ ...nextPageObj, page: `${PAGES.CONFIRM_ANSWERS}` });
    }
  }

  const nextPageGroup = questionMapper(questionNumber + 1, FLOW.TELEPHONE);
  const doesNextPageAnswersExist = !!cookieData[nextPageGroup];
  if (isChangeAnswer && doesNextPageAnswersExist) {
    return nextPage({ ...nextPageObj, page: `${PAGES.CONFIRM_ANSWERS}` });
  }

  return nextPage(nextPageObj);
};

const getNextOnlineFlowPage = (
  questionNumber: number,
  cookieData: DataFromQuery,
  prefix: string,
) => {
  const nextPageObj = {
    path: getCurrentPath(FLOW.ONLINE),
    page: `${prefix}${questionNumber + 1}`,
  };

  switch (questionNumber) {
    case 1: {
      const currentAnswer = cookieData[FORM_FIELDS.consentOnline]?.value;
      if (currentAnswer === '1') {
        return nextPage({ ...nextPageObj, page: PAGES.CONSENT_REJECTED });
      }
      break;
    }
    case 3: {
      return nextPage({ ...nextPageObj, page: `${PAGES.CONFIRM_ANSWERS}` });
    }
  }

  return nextPage(nextPageObj);
};
