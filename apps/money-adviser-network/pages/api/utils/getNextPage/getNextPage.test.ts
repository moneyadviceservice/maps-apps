import { getNextPage } from '.';
import { PAGES, PATHS } from '../../../../CONSTANTS';
import { FLOW } from '../../../../utils/getQuestions';

const startPath = PATHS.START;
const startFlow = FLOW.START;

describe('getNextPage', () => {
  it.each`
    description                                                                            | error    | questionNumber | answer | currentFlow  | isChangeAnswer | expected
    ${'Q1 - Goes to debt if 2nd radio is selected'}                                        | ${false} | ${1}           | ${'0'} | ${startFlow} | ${undefined}   | ${`/${startPath}/${PAGES.MONEY_MANAGEMENT_REFER}`}
    ${'Q1 - Goes to money management if 1st radio is selected '}                           | ${false} | ${1}           | ${'1'} | ${startFlow} | ${undefined}   | ${`/${startPath}/q-2`}
    ${'Q2 - Goes to next question when 1st radio is selected'}                             | ${false} | ${2}           | ${'0'} | ${startFlow} | ${undefined}   | ${`/${startPath}/q-3`}
    ${'Q2 - Goes to DEBT_ADVICE_LOCATOR when 1st radio is NOT selected'}                   | ${false} | ${2}           | ${'1'} | ${startFlow} | ${undefined}   | ${`/${startPath}/${PAGES.DEBT_ADVICE_LOCATOR}`}
    ${'Q2 - Stays on page when error is true'}                                             | ${true}  | ${2}           | ${''}  | ${startFlow} | ${undefined}   | ${`/${startPath}/q-2`}
    ${'Q2 - Returns to confirm answers page when isChangeAnswer is true'}                  | ${false} | ${2}           | ${'0'} | ${startFlow} | ${true}        | ${`/${startPath}/${PAGES.CONFIRM_ANSWERS}`}
    ${'Q2 - Does not return to confirm answers when new answer changes the question flow'} | ${false} | ${2}           | ${'1'} | ${startFlow} | ${true}        | ${`/${startPath}/${PAGES.DEBT_ADVICE_LOCATOR}`}
    ${'Q3 - Goes to BUSINESS_DEBTLINE_REFER when 1st radio is selected'}                   | ${false} | ${3}           | ${'0'} | ${startFlow} | ${undefined}   | ${`/${startPath}/${PAGES.BUSINESS_DEBTLINE_REFER}`}
    ${'Q3 - Goes to next question when 2nd radio is selected'}                             | ${false} | ${3}           | ${'1'} | ${startFlow} | ${undefined}   | ${`/${startPath}/q-4`}
  `(
    '$description',
    ({
      error,
      questionNumber,
      answer,
      currentFlow,
      isChangeAnswer,
      expected,
    }) => {
      const data = !isChangeAnswer
        ? { [`q-${questionNumber}`]: answer }
        : {
            [`q-${questionNumber}`]: answer,
            [`q-${questionNumber + 1}`]: answer,
          };
      const result = getNextPage(
        error,
        questionNumber,
        data,
        {},
        currentFlow,
        isChangeAnswer,
      );
      expect(result).toBe(expected);
    },
  );
});
