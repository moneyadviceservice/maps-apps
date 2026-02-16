import { navigationRules, NavigationRules } from './navigationRules';

type RuleKey = keyof NavigationRules;

describe('Navigation rules', () => {
  describe('Redundancy Pay Calculator', () => {
    let mockData: any = {};
    beforeEach(() => {
      mockData = {
        'q-1': '1',
        'q-2': '2',
        'q-3': '1',
        'q-4': '2',
        'q-5': '1',
        'q-6': '1',
        'q-7': '1',
        language: 'en',
        question: 'question-6',
      };
    });

    it.each`
      description                                              | rule        | qIndex | updateQ | answerIndex | expected
      ${'skip Q7 if second or third answer is selected in Q3'} | ${'skipQ7'} | ${6}   | ${6}    | ${1}        | ${true}
    `('$description', ({ rule, qIndex, updateQ, answerIndex, expected }) => {
      if (updateQ) {
        mockData[`q-${updateQ}`] = answerIndex.toString();
      }

      const rules = navigationRules(qIndex, mockData);
      expect(rules?.[rule as RuleKey]).toBe(expected);
    });
  });
});
