import {
  TOOL_PATH,
  MONEY_MANAGEMENT_REFER,
  DEBT_ADVICE_LOCATOR,
  BUSINESS_DEBTLINE_REFER,
} from '../../../../CONSTANTS';
import { getNextPage } from '.';

describe('getNextPage', () => {
  it.each`
    description                                                          | error    | questionNumber | answer | expected
    ${'Q1 - Goes to debt if 2nd radio is selected'}                      | ${false} | ${1}           | ${'0'} | ${`/${MONEY_MANAGEMENT_REFER}`}
    ${'Q1 - Goes to money management if 1st radio is selected '}         | ${false} | ${1}           | ${'1'} | ${`/${TOOL_PATH}/q-2`}
    ${'Q2 - Goes to next question when 1st radio is selected'}           | ${false} | ${2}           | ${'0'} | ${`/${TOOL_PATH}/q-3`}
    ${'Q2 - Goes to DEBT_ADVICE_LOCATOR when 1st radio is NOT selected'} | ${false} | ${2}           | ${'1'} | ${`/${DEBT_ADVICE_LOCATOR}`}
    ${'Q2 - Stays on page when error is true'}                           | ${true}  | ${2}           | ${''}  | ${`/${TOOL_PATH}/q-2`}
    ${'Q3 - Goes to BUSINESS_DEBTLINE_REFER when 1st radio is selected'} | ${false} | ${3}           | ${'0'} | ${`/${BUSINESS_DEBTLINE_REFER}`}
    ${'Q3 - Goes to next question when 2nd radio is selected'}           | ${false} | ${3}           | ${'1'} | ${`/${TOOL_PATH}/q-4`}
  `('$path $description', ({ error, questionNumber, answer, expected }) => {
    const data = { [`q-${questionNumber}`]: answer };
    const result = getNextPage(error, questionNumber, data);
    expect(result).toBe(expected);
  });
});
