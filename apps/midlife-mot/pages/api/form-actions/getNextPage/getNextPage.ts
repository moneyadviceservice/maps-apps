import { NavigationRules } from 'utils/NavigationRules';

export const getNextPage = (
  error: boolean,
  questionNumber: number,
  navRules: NavigationRules | undefined,
  isAnswerChanged: boolean,
  target: string,
) => {
  if (error) {
    return `/question-${questionNumber}`;
  } else if (navRules?.skipQ16) {
    return '/change-options';
  } else if (navRules?.skipQ12) {
    return '/question-14';
  } else if (isAnswerChanged) {
    return '/change-options';
  } else if (target.length > 0) {
    return target;
  } else {
    return `/question-${questionNumber + 1}`;
  }
};
