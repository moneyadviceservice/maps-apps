import { QUESTION_PREFIX } from 'CONSTANTS';
import { DataPath } from 'types';
import { NavigationRules } from 'utils/NavigationRules';

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

export const transformData = (
  error: boolean,
  navRules: NavigationRules | undefined,
  data: Record<string, any>,
  question: string,
  path: DataPath,
): Record<string, any> | undefined => {
  if (path === DataPath.PensionType) {
    return transformPensionTypeData(error, navRules, data, question);
  }
  return {};
};
