import { NavigationRules } from '../transformers/transformData';

/** Next page rules:
 * - If there is an error, return to the current question
 */
export const getNextPage = (
  error: boolean,
  questionNumber: number,
  navRules: NavigationRules | undefined,
) => {
  if (error) {
    return `question-${questionNumber}`;
  } else if (navRules?.skipQ3) {
    return 'business-debtline-refer';
  } else if (navRules?.skipQ4) {
    return 'debtline-refer';
  } else if (navRules?.CONTINUE) {
    return 'face-to-face-debtline-refer';
  }
  return `question-${questionNumber + 1}`;
};
