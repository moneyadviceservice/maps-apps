import { QUESTION_PREFIX } from 'CONSTANTS';
import { DataPath } from 'types';

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

/** Next page rules:
 *
 *
 * if it is question 1 and any of the following answers are selected then skip to change options page
 * Question 1, answer 2 (index 1) (No)
 *
 * if it is question 2 and any of the following answers are selected then skip to change options page
 * Question 2, answer 1 (index 0) (Yes)
 *
 * if it is question 3 and any of the following answers are selected then skip to change options page
 * Question 3, answer 1 (index 0) (Yes)
 *
 */
export const pensionTypeNavigationRules = (
  question: number,
  data: Record<string, any>,
): NavigationRules => {
  return {
    CONTINUE: question === 1 || question === 2 || question === 3,
    skipQ2: question === 1 && Number(data[`${QUESTION_PREFIX}1`]) === 1,
    skipQ3: question === 2 && Number(data[`${QUESTION_PREFIX}2`]) === 0,
    skipQ4: question === 3 && Number(data[`${QUESTION_PREFIX}3`]) === 0,
  };
};

export const navigationRules = (
  question: number,
  data: Record<string, any>,
  dataPath: DataPath,
): NavigationRules | undefined => {
  switch (dataPath) {
    case DataPath.MidLifeMot:
      return midLifeMotNavigationRules(question, data);
    case DataPath.PensionType:
      return pensionTypeNavigationRules(question, data);
    default:
      return;
  }
};
