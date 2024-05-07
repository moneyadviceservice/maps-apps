import { DataPath } from 'types';
import { NavigationRules } from 'utils/NavigationRules';

/** Next page rules:
 *
 * if no answer selected then redirect to the same page and add 'error' query parameter
 *
 * if it is question 17 and  any of the following answers are selected then skip step 17 to step 19
 * Question 3, answer 1
 * Question 3, answer 3
 * Question 4, answer 2
 * Question 8, answer 3
 *
 * or if it is question 12 and the second answer is selected go to step 12 otherwise go to step 14
 *
 * if an answer selected that leads to triage page then navigate to that page.
 */
const getNextMidLifeMotPage = (
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

/** Next page rules:
 *
 * if no answer selected then redirect to the same page and add 'error' query parameter
 *
 * if it is question 4 and any of the following answers are selected then skip step 4 to step 5
 * Question 3, answer 4
 *
 * if an answer selected that leads to triage page then navigate to that page.
 */

const getNextCreditRejectionPage = (
  error: boolean,
  questionNumber: number,
  navRules: NavigationRules | undefined,
  isAnswerChanged: boolean,
  target: string,
) => {
  if (error) {
    return `/question-${questionNumber}`;
  } else if (navRules?.skipQ4) {
    return '/question-5';
  } else if (isAnswerChanged) {
    return '/change-options';
  } else if (target.length > 0) {
    return target;
  } else {
    return `/question-${questionNumber + 1}`;
  }
};

const getNextCreditOptionsPage = (
  error: boolean,
  questionNumber: number,
  navRules: NavigationRules | undefined,
  isAnswerChanged: boolean,
  target: string,
) => {
  if (error) {
    return `/question-${questionNumber}`;
  } else if (isAnswerChanged) {
    return '/change-options';
  } else if (target.length > 0) {
    return target;
  } else {
    return `/question-${questionNumber + 1}`;
  }
};

const getNextPensionTypePage = (
  error: boolean,
  questionNumber: number,
  navRules: NavigationRules | undefined,
  isAnswerChanged: boolean,
  target: string,
) => {
  if (error) {
    return `/question-${questionNumber}`;
  } else if (navRules?.skipQ2 || navRules?.skipQ3 || navRules?.skipQ4) {
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
  switch (path) {
    case DataPath.MidLifeMot:
      return getNextMidLifeMotPage(
        error,
        questionNumber,
        navRules,
        isAnswerChanged,
        target,
      );
    case DataPath.CreditRejection:
      return getNextCreditRejectionPage(
        error,
        questionNumber,
        navRules,
        isAnswerChanged,
        target,
      );
    case DataPath.CreditOptions:
      return getNextCreditOptionsPage(
        error,
        questionNumber,
        navRules,
        isAnswerChanged,
        target,
      );
    case DataPath.PensionType:
      return getNextPensionTypePage(
        error,
        questionNumber,
        navRules,
        isAnswerChanged,
        target,
      );
    default:
      return '';
  }
};
