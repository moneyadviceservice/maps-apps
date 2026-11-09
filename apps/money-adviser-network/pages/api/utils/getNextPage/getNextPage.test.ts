import { getNextPage } from '.';
import { PAGES, PATHS } from '../../../../CONSTANTS';
import { FORM_FIELDS, FORM_GROUPS } from '../../../../data/questions/types';
import { FLOW } from '../../../../utils/getQuestions';

const startPath = PATHS.START;
const onlinePath = PATHS.ONLINE;
const telPath = PATHS.TELEPHONE;

const startFlow = FLOW.START;
const onlineFlow = FLOW.ONLINE;
const telFlow = FLOW.TELEPHONE;

describe('getNextPage', () => {
  it.each`
    description                                                                            | error    | questionNumber | answer | isChangeAnswer | expected
    ${'Q1 - Goes to debt if 2nd radio is selected'}                                        | ${false} | ${1}           | ${'0'} | ${undefined}   | ${`/${startPath}/${PAGES.MONEY_MANAGEMENT_REFER}`}
    ${'Q1 - Goes to money management if 1st radio is selected '}                           | ${false} | ${1}           | ${'1'} | ${undefined}   | ${`/${startPath}/q-2`}
    ${'Q2 - Goes to next question when 1st radio is selected'}                             | ${false} | ${2}           | ${'0'} | ${undefined}   | ${`/${startPath}/q-3`}
    ${'Q2 - Goes to DEBT_ADVICE_LOCATOR when 1st radio is NOT selected'}                   | ${false} | ${2}           | ${'1'} | ${undefined}   | ${`/${startPath}/${PAGES.DEBT_ADVICE_LOCATOR}`}
    ${'Q2 - Stays on page when error is true'}                                             | ${true}  | ${2}           | ${''}  | ${undefined}   | ${`/${startPath}/q-2`}
    ${'Q2 - Returns to confirm answers page when isChangeAnswer is true'}                  | ${false} | ${2}           | ${'0'} | ${true}        | ${`/${startPath}/${PAGES.CONFIRM_ANSWERS}`}
    ${'Q2 - Does not return to confirm answers when new answer changes the question flow'} | ${false} | ${2}           | ${'1'} | ${true}        | ${`/${startPath}/${PAGES.DEBT_ADVICE_LOCATOR}`}
    ${'Q3 - Goes to BUSINESS_DEBTLINE_REFER when 1st radio is selected'}                   | ${false} | ${3}           | ${'0'} | ${undefined}   | ${`/${startPath}/${PAGES.BUSINESS_DEBTLINE_REFER}`}
    ${'Q3 - Goes to next question when 2nd radio is selected'}                             | ${false} | ${3}           | ${'1'} | ${undefined}   | ${`/${startPath}/q-4`}
  `(
    `Tests start flow $description`,
    ({ error, questionNumber, answer, isChangeAnswer, expected }) => {
      const data = !isChangeAnswer
        ? { [`q-${questionNumber}`]: answer }
        : {
            [`q-${questionNumber}`]: answer,
            [`q-${questionNumber + 1}`]: answer,
          };

      const cookieData = {};

      const result = getNextPage(
        error,
        questionNumber,
        data,
        cookieData,
        startFlow,
        isChangeAnswer,
      );

      expect(result).toBe(expected);
    },
  );

  it.each`
    description                                                 | error    | questionNumber | question                       | answer            | expected
    ${'Q1 - Goes to your references if 1st radio is selected'}  | ${false} | ${1}           | ${FORM_GROUPS.consentOnline}   | ${{ value: '0' }} | ${`/${onlinePath}/o-2`}
    ${'Q1 - Goes to CONSENT_REJECTED if 2nd radio is selected'} | ${false} | ${1}           | ${FORM_GROUPS.consentOnline}   | ${{ value: '1' }} | ${`/${onlinePath}/${PAGES.CONSENT_REJECTED}`}
    ${'Q2 - Goes to next question when no errors'}              | ${false} | ${2}           | ${FORM_GROUPS.reference}       | ${{ value: '' }}  | ${`/${onlinePath}/o-3`}
    ${'Q2 - Stays on page when error is true'}                  | ${true}  | ${2}           | ${FORM_GROUPS.reference}       | ${{ value: '' }}  | ${`/${onlinePath}/o-2`}
    ${'Q3 - Goes to next confirm answers when no errors'}       | ${false} | ${3}           | ${FORM_GROUPS.customerDetails} | ${{ value: '' }}  | ${`/${onlinePath}/${PAGES.CONFIRM_ANSWERS}`}
    ${'Q3 - Stays on page when error is true'}                  | ${true}  | ${3}           | ${FORM_GROUPS.customerDetails} | ${{ value: '' }}  | ${`/${onlinePath}/o-3`}
  `(
    `Tests online flow $description`,
    ({ error, questionNumber, question, answer, expected }) => {
      const data = {};

      const cookieData = { [onlineFlow]: { [question]: answer } };

      const result = getNextPage(
        error,
        questionNumber,
        data,
        cookieData,
        onlineFlow,
      );

      expect(result).toBe(expected);
    },
  );

  it.each`
    description                                                      | error    | questionNumber | question                         | answer            | expected
    ${'Q1 - Goes to reference consent if user accepts'}              | ${false} | ${1}           | ${FORM_GROUPS.consentDetails}    | ${{ value: '0' }} | ${`/${telPath}/t-2`}
    ${'Q1 - Goes to CONSENT_REJECTED if user declines'}              | ${false} | ${1}           | ${FORM_GROUPS.consentDetails}    | ${{ value: '1' }} | ${`/${telPath}/${PAGES.CONSENT_REJECTED}`}
    ${'Q2 - Goes to reference fields when user accepts'}             | ${false} | ${2}           | ${FORM_GROUPS.consentReferral}   | ${{ value: '0' }} | ${`/${telPath}/t-3`}
    ${'Q2 - Skips reference fields when user declines'}              | ${false} | ${2}           | ${FORM_GROUPS.consentReferral}   | ${{ value: '1' }} | ${`/${telPath}/t-4`}
    ${'Q3 - Goes to next question when no errors'}                   | ${false} | ${3}           | ${FORM_GROUPS.reference}         | ${{ value: '' }}  | ${`/${telPath}/t-4`}
    ${'Q3 - Stays on page when error is true'}                       | ${true}  | ${3}           | ${FORM_GROUPS.reference}         | ${{ value: '' }}  | ${`/${telPath}/t-3`}
    ${'Q4 - Goes to next question when select timeslot is selected'} | ${false} | ${4}           | ${FORM_FIELDS.whenToSpeak}       | ${{ value: '1' }} | ${`/${telPath}/t-5`}
    ${'Q4 - Skips timeslot when immediate callback is selected'}     | ${false} | ${4}           | ${FORM_FIELDS.whenToSpeak}       | ${{ value: '0' }} | ${`/${telPath}/t-6`}
    ${'Q5 - Goes to next question when no errors'}                   | ${false} | ${5}           | ${FORM_GROUPS.timeSlot}          | ${{ value: '0' }} | ${`/${telPath}/t-6`}
    ${'Q5 - Stays on page when error is true'}                       | ${true}  | ${5}           | ${FORM_GROUPS.timeSlot}          | ${{ value: '' }}  | ${`/${telPath}/t-5`}
    ${'Q6 - Goes to next question when no errors'}                   | ${false} | ${6}           | ${FORM_GROUPS.customerDetails}   | ${{ value: '' }}  | ${`/${telPath}/t-7`}
    ${'Q6 - Stays on page when error is true'}                       | ${true}  | ${6}           | ${FORM_GROUPS.customerDetails}   | ${{ value: '' }}  | ${`/${telPath}/t-6`}
    ${'Q7 - Goes to confirm answers when no errors'}                 | ${false} | ${7}           | ${FORM_GROUPS.securityQuestions} | ${{ value: '' }}  | ${`/${telPath}/${PAGES.CONFIRM_ANSWERS}`}
    ${'Q7 - Stays on page when error is true'}                       | ${true}  | ${7}           | ${FORM_GROUPS.securityQuestions} | ${{ value: '' }}  | ${`/${telPath}/t-7`}
  `(
    `Tests telephone flow $description`,
    ({ error, questionNumber, question, answer, expected }) => {
      const data = {};

      const cookieData = { [telFlow]: { [question]: answer } };

      const result = getNextPage(
        error,
        questionNumber,
        data,
        cookieData,
        telFlow,
      );

      expect(result).toBe(expected);
    },
  );
});
