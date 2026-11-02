import { DataPath } from 'types';
import { QUESTION_PREFIX } from 'utils/constants';
import { NavigationRules } from 'utils/NavigationRules';

import { DataFromQuery } from '@maps-react/utils/pageFilter';

const transformPensionTypeData = (
  error: boolean,
  navRules: NavigationRules | undefined,
  data: DataFromQuery,
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
  data: DataFromQuery,
  question: string,
  path: DataPath,
): DataFromQuery | undefined => {
  if (path === DataPath.PensionType) {
    return transformPensionTypeData(error, navRules, data, question);
  }
  return {};
};
