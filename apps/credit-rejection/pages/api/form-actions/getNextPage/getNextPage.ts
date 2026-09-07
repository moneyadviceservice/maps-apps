import { NavigationRules } from 'utils/NavigationRules';

export const getNextPage = (
  questionNumber: number,
  navRules: NavigationRules | undefined,
  isAnswerChanged: boolean,
  target: string,
) => {
  if (navRules?.skipQ4) {
    return '/question-5';
  } else if (isAnswerChanged) {
    return '/change-options';
  } else if (target.length > 0) {
    return target;
  } else {
    return `/question-${questionNumber + 1}`;
  }
};
