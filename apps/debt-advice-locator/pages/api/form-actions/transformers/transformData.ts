import { QUESTION_PREFIX } from 'CONSTANTS';

export interface NavigationRules {
  CONTINUE: boolean;
  skipQ2?: boolean;
  skipQ3?: boolean;
  skipQ4?: boolean;
}

export const navigationRules = (
  question: number,
  data: Record<string, any>,
): NavigationRules => {
  return {
    CONTINUE: question === 4 && data[`${QUESTION_PREFIX}4`]?.length > 0,
    skipQ2: false,
    skipQ3: question === 2 && Number(data[`${QUESTION_PREFIX}2`]) === 0,
    skipQ4:
      question === 3 &&
      (Number(data[`${QUESTION_PREFIX}3`]) === 0 ||
        Number(data[`${QUESTION_PREFIX}3`]) === 1),
  };
};

export const transformData = (
  error: boolean,
  data: Record<string, any>,
  question: string,
) => {
  let tdata = { ...data };
  if (error) {
    tdata = {
      ...tdata,
      error: question,
    };
  }
  return tdata;
};
