import { QUESTION_PREFIX } from 'CONSTANTS';

export interface NavigationRules {
  CONTINUE: boolean;
  skipQ2?: boolean;
  skipQ3?: boolean;
  skipQ4?: boolean;
  skipQ12?: boolean;
  skipQ16?: boolean;
}

/** Next page rules:
 *
 *
 * if it is question 4 (number 3) and any of the following answers are selected then skip question 4 to question 5
 * Question 3, answer 3
 *
 */
export const navigationRules = (
  question: number,
  data: Record<string, any>,
): NavigationRules | undefined => {
  return {
    CONTINUE: question === 3,
    skipQ4: question === 3 && Number(data[`${QUESTION_PREFIX}3`]) === 2,
  };
};
