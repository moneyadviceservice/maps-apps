import { DataPath } from 'types';

import { NavigationRules, navigationRules } from './navigationRules';

type RuleKey = keyof NavigationRules;

describe('Navigation rules', () => {
  describe('Mid Life MOT', () => {
    let mockData: any = {};
    beforeEach(() => {
      mockData = {
        'q-1': '1',
        'score-q-1': '0',
        'q-2': '2',
        'score-q-2': '0',
        'q-3': '1',
        'score-q-3': '1',
        'q-4': '2',
        'score-q-4': '2',
        'q-5': '0,1',
        'score-q-5': '3',
        language: 'en',
        question: 'question-6',
      };
    });

    it.each`
      description                                                     | rule          | qIndex | updateQ      | answerIndex  | score        | expected
      ${'skip Q16 if first answer is selected in Q3'}                 | ${'skipQ16'}  | ${15}  | ${3}         | ${0}         | ${1}         | ${true}
      ${'skip Q16 if third answer is selected in Q3'}                 | ${'skipQ16'}  | ${15}  | ${3}         | ${2}         | ${1}         | ${true}
      ${'skip Q16 if second answer is selected in Q4'}                | ${'skipQ16'}  | ${15}  | ${4}         | ${1}         | ${1}         | ${true}
      ${'skip Q16 if third answer is selected in Q8'}                 | ${'skipQ16'}  | ${15}  | ${8}         | ${2}         | ${1}         | ${true}
      ${'skip Q12-Q13 if second answer is selected in Q11'}           | ${'skipQ12'}  | ${11}  | ${11}        | ${0}         | ${1}         | ${true}
      ${'do not skip Q12-Q13 if any other answer is selected in Q11'} | ${'skipQ12'}  | ${11}  | ${11}        | ${1}         | ${1}         | ${false}
      ${'have Continue button if Q3 is selected to change'}           | ${'CONTINUE'} | ${3}   | ${undefined} | ${undefined} | ${undefined} | ${true}
      ${'have Continue button if Q4 is selected to change'}           | ${'CONTINUE'} | ${4}   | ${undefined} | ${undefined} | ${undefined} | ${true}
      ${'have Continue button if Q8 is selected to change'}           | ${'CONTINUE'} | ${8}   | ${undefined} | ${undefined} | ${undefined} | ${true}
      ${'have Continue button if Q11 is selected to change'}          | ${'CONTINUE'} | ${11}  | ${11}        | ${0}         | ${1}         | ${true}
    `(
      '$description',
      ({ rule, qIndex, updateQ, answerIndex, score, expected }) => {
        if (updateQ) {
          mockData[`q-${updateQ}`] = answerIndex.toString();
          mockData[`score-q-${updateQ}`] = score.toString();
        }
        const rules = navigationRules(qIndex, mockData, DataPath.MidLifeMot);
        expect(rules?.[rule as RuleKey]).toBe(expected);
      },
    );
  });

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
