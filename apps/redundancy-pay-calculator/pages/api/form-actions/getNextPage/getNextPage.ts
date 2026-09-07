import { NavigationRules } from 'utils/NavigationRules';

/** Next page rules:
 * - If there is an error, return to the current question.
 * - If the user answers "Yes" to q-6, continue to q-7.
 * - If the user answers "No" to q-6, skip to /change-answers.
 */
export const getNextPage = (
  error: boolean,
  questionNumber: number,
  navRules: NavigationRules | undefined,
  isAnswerChanged: boolean,
  target: string,
) => {
  if (error) {
    return `/question-${questionNumber}`;
  }

  if (navRules?.redirectToQ7) {
    return '/question-7';
  }

  if (isAnswerChanged || navRules?.skipQ7) {
    return '/change-options';
  } else if (target.length > 0) {
    return target;
  } else {
    return `/question-${questionNumber + 1}`;
  }
};
