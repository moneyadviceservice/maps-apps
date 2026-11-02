import { QUESTION_PREFIX } from 'CONSTANTS';

export interface NavigationRules {
  CONTINUE: boolean;
  skipQ7?: boolean;
  redirectToQ7?: boolean;
}

/**
 * Determines navigation rules based on the current question, provided data, and whether the answer has changed.
 *
 * @param question - The current question number.
 * @param data - A record containing question-answer pairs, where keys are question identifiers and values are answers.
 * @param isAnswerChanged - Optional flag indicating if the answer to the current question has changed.
 * @returns An object representing navigation rules or `undefined` if no rules apply.
 *
 * The returned object may contain the following properties:
 * - `CONTINUE`: A boolean indicating whether to continue to the next question when the current question is 6,
 *   the answer to question 6 is 0, and the answer has not changed.
 * - `skipQ7`: A boolean indicating whether to skip question 7 when the current question is 6 and the answer
 *   to question 6 is either 1 or 2.
 * - `redirectToQ7`: A boolean indicating whether to redirect to question 7 when the current question is 6,
 *   the answer to question 6 is 0, and the answer has changed.
 */
export const navigationRules = (
  question: number,
  data: Record<string, string>,
  isAnswerChanged?: boolean,
): NavigationRules | undefined => {
  const answerQ6 = Number(data[`${QUESTION_PREFIX}6`]);
  return {
    CONTINUE: question === 6 && answerQ6 === 0 && !isAnswerChanged,
    skipQ7: question === 6 && (answerQ6 === 1 || answerQ6 === 2),
    redirectToQ7: question === 6 && answerQ6 === 0 && isAnswerChanged,
  };
};
