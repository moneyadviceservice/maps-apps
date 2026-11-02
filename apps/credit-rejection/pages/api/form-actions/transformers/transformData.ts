import { QUESTION_PREFIX, SCORE_PREFIX } from 'CONSTANTS';
import { NavigationRules } from 'utils/NavigationRules';

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
      delete transformedData[SCORE_PREFIX + el];
    });
  }
  return transformedData;
};

export const transformData = (
  error: boolean,
  navRules: NavigationRules | undefined,
  data: Record<string, any>,
  question: string,
): Record<string, any> | undefined => {
  return transformCreditRejectionData(error, navRules, data, question);
};
