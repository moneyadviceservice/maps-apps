import { QUESTION_PREFIX, SCORE_PREFIX } from 'CONSTANTS';
import { DataPath } from 'types';
import { NavigationRules } from 'utils/NavigationRules';

const transformMidLifeMotData = (
  error: boolean,
  navRules: NavigationRules | undefined,
  data: Record<string, any>,
  question: string,
) => {
  let transformedData = { ...data };
  if (error) {
    transformedData = {
      ...transformedData,
      error: question,
    };
  } else if (navRules?.skipQ16) {
    [16, 17, 18].forEach((el) => {
      delete transformedData[QUESTION_PREFIX + el];
      delete transformedData[SCORE_PREFIX + el];
    });
  } else if (navRules?.skipQ12) {
    [12, 13].forEach((p) => {
      delete transformedData[QUESTION_PREFIX + p];
      delete transformedData[SCORE_PREFIX + p];
    });
  }
  return transformedData;
};

const transformCreditRejectionData = (
  error: boolean,
  navRules: NavigationRules | undefined,
  data: Record<string, any>,
  question: string,
) => {
  let transformedData = { ...data };
  if (error) {
    transformedData = {
      ...transformedData,
      error: question,
    };
  } else if (navRules?.skipQ4) {
    [4].forEach((el) => {
      delete transformedData[QUESTION_PREFIX + el];
    });
  }
  return transformedData;
};

const transformCreditOptionsData = (
  error: boolean,
  navRules: NavigationRules | undefined,
  data: Record<string, any>,
  question: string,
) => {
  let transformedData = { ...data };
  if (error) {
    transformedData = {
      ...transformedData,
      error: question,
    };
  }
  return transformedData;
};

const transformPensionTypeData = (
  error: boolean,
  navRules: NavigationRules | undefined,
  data: Record<string, any>,
  question: string,
) => {
  let transformedData = { ...data };
  if (error) {
    transformedData = {
      ...transformedData,
      error: question,
    };
  } else if (navRules?.skipQ2) {
    [2, 3, 4].forEach((el) => {
      delete transformedData[QUESTION_PREFIX + el];
    });
  } else if (navRules?.skipQ3) {
    [3, 4].forEach((el) => {
      delete transformedData[QUESTION_PREFIX + el];
    });
  } else if (navRules?.skipQ4) {
    [4].forEach((el) => {
      delete transformedData[QUESTION_PREFIX + el];
    });
  }
  return transformedData;
};

const transformDebtAdviceLocatorTypeData = (
  error: boolean,
  navRules: NavigationRules | undefined,
  data: Record<string, any>,
  question: string,
) => {
  let tdata = { ...data };
  if (error) {
    tdata = {
      ...tdata,
      error: question,
    };
  }
  return tdata;
};

export const transformData = (
  error: boolean,
  navRules: NavigationRules | undefined,
  data: Record<string, any>,
  question: string,
  path: DataPath,
): Record<string, any> | undefined => {
  switch (path) {
    case DataPath.MidLifeMot:
      return transformMidLifeMotData(error, navRules, data, question);
    case DataPath.CreditRejection:
      return transformCreditRejectionData(error, navRules, data, question);
    case DataPath.CreditOptions:
      return transformCreditOptionsData(error, navRules, data, question);
    case DataPath.PensionType:
      return transformPensionTypeData(error, navRules, data, question);
    case DataPath.DebtAdviceLocator:
      return transformDebtAdviceLocatorTypeData(
        error,
        navRules,
        data,
        question,
      );
    default:
      return {};
  }
};
