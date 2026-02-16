import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { PAGES, PATHS } from '../../../../CONSTANTS';
import { FORM_FIELDS, FORM_GROUPS } from '../../../../data/questions/types';
import { getCurrentPath } from '../../../../utils/getCurrentPath';
import { getPrefix } from '../../../../utils/getPrefix';
import { FLOW } from '../../../../utils/getQuestions';
import { questionMapper } from '../../../../utils/questionMapper';

type NextPageObject = {
  path: string;
  page: string;
};

const nextPage = ({ path, page }: NextPageObject) => `/${path}/${page}`;

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

  switch (currentFlow) {
    case FLOW.ONLINE:
      return getNextOnlineFlowPage(
        questionNumber,
        cookieData?.[currentFlow],
        nextPageObj,
      );
    case FLOW.TELEPHONE:
      return getNextTelephoneFlowPage(
        questionNumber,
        cookieData?.[currentFlow],
        prefix,
        nextPageObj,
        isChangeAnswer,
      );
    default:
      return getNextStartFlowPage(
        questionNumber,
        prefix,
        data,
        nextPageObj,
        prevData,
        isChangeAnswer,
      );
  }
};

const getNextStartFlowPage = (
  questionNumber: number,
  prefix: string,
  data: DataFromQuery,
  nextPageObj: NextPageObject,
  prevData?: DataFromQuery,
  isChangeAnswer?: boolean,
) => {
  const currentAnswer = data[`${prefix}${questionNumber}`];
  const handleQuestion4 = () => {
    const isAnswerTheSame =
      prevData && prevData[`${prefix}${questionNumber}`] === currentAnswer;

    if (currentAnswer === '0') {
      return isChangeAnswer && isAnswerTheSame
        ? nextPage({ path: PATHS.ONLINE, page: PAGES.CONFIRM_ANSWERS })
        : nextPage({ path: PATHS.ONLINE, page: `o-1` });
    }

    if (currentAnswer === '1') {
      return isChangeAnswer && isAnswerTheSame
        ? nextPage({ path: PATHS.TELEPHONE, page: PAGES.CONFIRM_ANSWERS })
        : nextPage({ path: PATHS.TELEPHONE, page: `t-1` });
    }

    if (currentAnswer === '2') {
      return nextPage({
        path: PATHS.FACE,
        page: PAGES.DEBT_ADVICE_LOCATOR,
      });
    }
  };

  const questionHandlers = {
    1: () => {
      if (currentAnswer === '0') {
        return nextPage({ ...nextPageObj, page: PAGES.MONEY_MANAGEMENT_REFER });
      }
    },
    2: () => {
      if (currentAnswer !== '0') {
        return nextPage({ ...nextPageObj, page: PAGES.DEBT_ADVICE_LOCATOR });
      }
    },
    3: () => {
      if (currentAnswer === '0') {
        return nextPage({
          ...nextPageObj,
          page: PAGES.BUSINESS_DEBTLINE_REFER,
        });
      }
    },
    4: handleQuestion4,
  };

  const handler = questionHandlers[questionNumber as 1 | 2 | 3 | 4];
  if (handler) {
    const result = handler();
    if (result) return result;
  }

  const nextQuestionHasAnswer = !!data[`${prefix}${questionNumber + 1}`];
  if (isChangeAnswer && nextQuestionHasAnswer) {
    return nextPage({ ...nextPageObj, page: PAGES.CONFIRM_ANSWERS });
  }

  return nextPage(nextPageObj);
};

const checkTelephoneCallbackOk = (cookieData: DataFromQuery) => {
  const whenToSpeak = cookieData[FORM_FIELDS.whenToSpeak]?.value;
  const timeSlot = cookieData[FORM_FIELDS.timeSlot]?.value;
  return whenToSpeak === '0' || (whenToSpeak === '1' && timeSlot);
};

const getNextTelephoneFlowPage = (
  questionNumber: number,
  cookieData: DataFromQuery,
  prefix: string,
  nextPageObj: NextPageObject,
  isChangeAnswer?: boolean,
) => {
  const isTelephoneCallbackOk = checkTelephoneCallbackOk(cookieData);

  const handleQuestion1 = () => {
    const currentAnswer = cookieData[FORM_FIELDS.consentDetails]?.value;
    if (currentAnswer === '1') {
      const doesNextPageAnswerExist =
        !!cookieData[FORM_FIELDS.consentReferral]?.value;

      return isChangeAnswer && doesNextPageAnswerExist && isTelephoneCallbackOk
        ? nextPage({ ...nextPageObj, page: PAGES.CONFIRM_ANSWERS })
        : nextPage({ ...nextPageObj, page: PAGES.CONSENT_REJECTED });
    }
  };

  const handleQuestion2 = () => {
    const currentAnswer = cookieData[FORM_FIELDS.consentReferral]?.value;
    if (currentAnswer === '1') {
      const doesNextPageAnswerExist =
        !!cookieData[FORM_FIELDS.whenToSpeak]?.value;

      return isChangeAnswer && doesNextPageAnswerExist && isTelephoneCallbackOk
        ? nextPage({ ...nextPageObj, page: PAGES.CONFIRM_ANSWERS })
        : nextPage({ ...nextPageObj, page: `${prefix}4` });
    }
  };

  const handleQuestion4 = () => {
    const currentAnswer = cookieData[FORM_FIELDS.whenToSpeak]?.value;
    if (currentAnswer === '0') {
      const doesNextPageAnswersExist =
        !!cookieData[FORM_GROUPS.customerDetails];

      return isChangeAnswer && doesNextPageAnswersExist
        ? nextPage({ ...nextPageObj, page: PAGES.CONFIRM_ANSWERS })
        : nextPage({ ...nextPageObj, page: `${prefix}6` });
    }
    if (currentAnswer === '1' && isChangeAnswer) {
      return nextPage(nextPageObj);
    }
  };

  const goToConfirmAnswers = () => {
    return nextPage({ ...nextPageObj, page: PAGES.CONFIRM_ANSWERS });
  };

  const questionHandlers = {
    1: handleQuestion1,
    2: handleQuestion2,
    4: handleQuestion4,
    7: goToConfirmAnswers,
    8: goToConfirmAnswers,
    9: goToConfirmAnswers,
  };

  const handler = questionHandlers[questionNumber as 1 | 2 | 4 | 7 | 8 | 9];
  if (handler) {
    const result = handler();
    if (result) return result;
  }

  const nextPageGroup = questionMapper(questionNumber + 1, FLOW.TELEPHONE);
  const doesNextPageAnswersExist = !!cookieData[nextPageGroup];

  if (isChangeAnswer && doesNextPageAnswersExist && isTelephoneCallbackOk) {
    return nextPage({ ...nextPageObj, page: PAGES.CONFIRM_ANSWERS });
  }

  return nextPage(nextPageObj);
};

const getNextOnlineFlowPage = (
  questionNumber: number,
  cookieData: DataFromQuery,
  nextPageObj: NextPageObject,
) => {
  const handleQuestion1 = () => {
    const currentAnswer = cookieData[FORM_FIELDS.consentOnline]?.value;
    if (currentAnswer === '1') {
      return nextPage({ ...nextPageObj, page: PAGES.CONSENT_REJECTED });
    }
  };

  const handleQuestion3 = () => {
    return nextPage({ ...nextPageObj, page: PAGES.CONFIRM_ANSWERS });
  };

  const questionHandlers = {
    1: handleQuestion1,
    3: handleQuestion3,
  };

  const handler = questionHandlers[questionNumber as 1 | 3];
  if (handler) {
    const result = handler();
    if (result) return result;
  }

  return nextPage(nextPageObj);
};
