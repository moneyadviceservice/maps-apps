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
 * if it is question 16 (number 15) and any of the following answers are selected then skip question 16 to question 19
 * Question 3, answer 1
 * Question 3, answer 3
 * Question 4, answer 2
 * Question 8, answer 3
 *
 */
export const midLifeMotNavigationRules = (
  question: number,
  data: Record<string, any>,
): NavigationRules => {
  return {
    CONTINUE:
      question === 3 || question === 4 || question === 8 || question === 11,
    skipQ16:
      question === 15 &&
      (Number(data[`${QUESTION_PREFIX}3`]) === 0 ||
        Number(data[`${QUESTION_PREFIX}3`]) === 2 ||
        Number(data[`${QUESTION_PREFIX}4`]) === 1 ||
        Number(data[`${QUESTION_PREFIX}8`]) === 2),
    skipQ12:
      question === 11 &&
      data[`${QUESTION_PREFIX}11`]
        ?.split(',')
        ?.filter((t: any) => Number(t) === 1).length === 0,
  };
};
