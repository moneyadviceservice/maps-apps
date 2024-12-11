import { DataFromQuery } from '@maps-react/utils/pageFilter';

export type Condition = {
  question: string;
  answer: string;
  arithmeticOperator?: string;
};

const processCondition = (
  condition: Condition,
  questionData: DataFromQuery,
) => {
  const key = 'q-' + condition.question;
  if (key in questionData) {
    const answerValues: number[] = questionData[key]
      .split(',')
      .map((value: string) => {
        const numericValue = value.replace('£', '');
        return parseFloat(numericValue.trim());
      });
    if (answerValues.every((value) => !isNaN(value))) {
      const answerValue = answerValues[0];
      if (
        condition.arithmeticOperator &&
        ['>', '<', '>=', '<='].includes(condition.arithmeticOperator)
      ) {
        const operator = condition.arithmeticOperator as
          | '>'
          | '<'
          | '>='
          | '<=';
        const threshold = parseFloat(condition.answer);
        switch (operator) {
          case '>':
            return answerValue > threshold;
          case '<':
            return answerValue < threshold;
          case '>=':
            return answerValue >= threshold;
          case '<=':
            return answerValue <= threshold;
          default:
            return false;
        }
      } else if (condition.answer.startsWith('!')) {
        const negatedAnswer = condition.answer.substring(1);
        return !questionData[key]
          .split(',')
          .some((ans: string) => ans.trim().includes(negatedAnswer));
      } else {
        return questionData[key]
          .split(',')
          .map((value: string) => value.trim())
          .includes(condition.answer);
      }
    }
  }
  return false;
};

export const checkCondition = (
  conditions: Condition[],
  questionData: DataFromQuery,
  allowAnyCondition = false,
) => {
  if (!allowAnyCondition) {
    return conditions.every((condition) =>
      processCondition(condition, questionData),
    );
  } else {
    return conditions.some((condition) =>
      processCondition(condition, questionData),
    );
  }
};
