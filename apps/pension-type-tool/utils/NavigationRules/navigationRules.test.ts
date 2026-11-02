import { DataPath } from 'types';

import { NavigationRules, navigationRules } from './navigationRules';

type RuleKey = keyof NavigationRules;

describe('Navigation rules', () => {
  describe('Pension Type', () => {
    let mockData: any = {};
    beforeEach(() => {
      mockData = {
        'q-1': '0',
        'q-2': '1',
        'q-3': '1',
        'q-4': '0',
        language: 'en',
      };
    });

    it.each`
      description                                                     | rule          | qIndex | updateQ      | answerIndex  | expected
      ${'skip Q2 if second answer is selected in Q1'}                 | ${'skipQ2'}   | ${1}   | ${1}         | ${1}         | ${true}
      ${'skip Q2 to be false if second answer is not selected in Q1'} | ${'skipQ2'}   | ${1}   | ${1}         | ${0}         | ${false}
      ${'skip Q3 if first answer is selected in Q2'}                  | ${'skipQ3'}   | ${2}   | ${2}         | ${0}         | ${true}
      ${'skip Q3 to be false if first answer is not selected in Q2'}  | ${'skipQ3'}   | ${2}   | ${2}         | ${1}         | ${false}
      ${'skip Q4 if first answer is selected in Q3'}                  | ${'skipQ4'}   | ${3}   | ${3}         | ${0}         | ${true}
      ${'skip Q4 to be false if first answer is not selected in Q3'}  | ${'skipQ3'}   | ${3}   | ${3}         | ${1}         | ${false}
      ${'have Continue button if Q1 is selected to change'}           | ${'CONTINUE'} | ${1}   | ${undefined} | ${undefined} | ${true}
      ${'have Continue button if Q2 is selected to change'}           | ${'CONTINUE'} | ${2}   | ${undefined} | ${undefined} | ${true}
      ${'have Continue button if Q3 is selected to change'}           | ${'CONTINUE'} | ${3}   | ${undefined} | ${undefined} | ${true}
    `('$description', ({ rule, qIndex, updateQ, answerIndex, expected }) => {
      if (updateQ) {
        mockData[`q-${updateQ}`] = answerIndex.toString();
      }
      const rules = navigationRules(qIndex, mockData, DataPath.PensionType);
      expect(rules?.[rule as RuleKey]).toBe(expected);
    });
  });
});
