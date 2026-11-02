import { QUESTION_PREFIX, SCORE_PREFIX } from 'CONSTANTS';
import { NavigationRules } from 'utils/NavigationRules';

export const transformData = (
  error: boolean,
  navRules: NavigationRules | undefined,
  data: Record<string, any>,
  question: string,
): Record<string, any> => {
  const transformedData = { ...data };

  if (error) {
    return {
      ...transformedData,
      error: question,
    };
  }

  if (navRules?.skipQ16) {
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
