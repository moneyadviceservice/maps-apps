import { navigationRules, NavigationRules } from './navigationRules';

type RuleKey = keyof NavigationRules;

describe('Navigation rules', () => {
  describe('Credit Rejection', () => {
    let mockData: any = {};
    beforeEach(() => {
      mockData = {
        'q-1': '1',
        'q-2': '2',
        'q-3': '1',
        'q-4': '2',
        'q-5': '0,1',
        'q-6': '0,1',
        'q-7': '0,1',
        'q-8': '0,1',
        language: 'en',
        question: 'question-5',
      };
    });

    it.each`
      description                                           | rule          | qIndex | updateQ      | answerIndex  | expected
      ${'skip Q4 if third answer is selected in Q3'}        | ${'skipQ4'}   | ${3}   | ${3}         | ${2}         | ${true}
      ${'have Continue button if Q3 is selected to change'} | ${'CONTINUE'} | ${3}   | ${undefined} | ${undefined} | ${true}
    `('$description', ({ rule, qIndex, updateQ, answerIndex, expected }) => {
      if (updateQ) {
        mockData[`q-${updateQ}`] = answerIndex.toString();
      }
      const rules = navigationRules(qIndex, mockData);
      expect(rules?.[rule as RuleKey]).toBe(expected);
    });
  });
});
