import { DataPath } from 'types';
import { NavigationRules } from 'utils/NavigationRules';

const getNextPensionTypePage = (
  questionNumber: number,
  navRules: NavigationRules | undefined,
  isAnswerChanged: boolean,
  target: string,
) => {
  if (navRules?.skipQ2 || navRules?.skipQ3 || navRules?.skipQ4) {
    return '/change-options';
  } else if (isAnswerChanged) {
    return '/change-options';
  } else if (target.length > 0) {
    return target;
  } else {
    return `/question-${questionNumber + 1}`;
  }
};

export const getNextPage = (
  error: boolean,
  path: DataPath,
  questionNumber: number,
  navRules: NavigationRules | undefined,
  isAnswerChanged: boolean,
  target: string,
) => {
  if (error) {
    return `/question-${questionNumber}`;
  }
  if (path === DataPath.PensionType) {
    return getNextPensionTypePage(
      questionNumber,
      navRules,
      isAnswerChanged,
      target,
    );
  }
  return `/question-${questionNumber + 1}`;
};
