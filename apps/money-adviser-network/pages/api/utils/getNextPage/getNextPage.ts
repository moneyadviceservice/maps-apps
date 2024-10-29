import {
  TOOL_PATH,
  MONEY_MANAGEMENT_REFER,
  DEBT_ADVICE_LOCATOR,
  BUSINESS_DEBTLINE_REFER,
} from '../../../../CONSTANTS';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

export const getNextPage = (
  error: boolean,
  questionNumber: number,
  data: DataFromQuery,
) => {
  if (error) {
    return `/${TOOL_PATH}/q-${questionNumber}`;
  }

  const currentAnswer = data[`q-${questionNumber}`];

  switch (questionNumber) {
    case 1: {
      if (currentAnswer === '0') {
        return `/${MONEY_MANAGEMENT_REFER}`;
      }
      break;
    }
    case 2: {
      if (currentAnswer !== '0') {
        return `/${DEBT_ADVICE_LOCATOR}`;
      }
      break;
    }
    case 3: {
      if (currentAnswer === '0') {
        return `/${BUSINESS_DEBTLINE_REFER}`;
      }
      break;
    }
  }

  return `/${TOOL_PATH}/q-${questionNumber + 1}`;
};
