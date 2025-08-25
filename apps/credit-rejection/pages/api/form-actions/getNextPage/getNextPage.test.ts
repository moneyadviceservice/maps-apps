import { getNextPage } from '.';

describe('getNextPage', () => {
  it.each`
    description                                       | questionNumber | navRules            | isAnswerChanged | target               | expected
    ${'CR goes to next question when no rules set'}   | ${1}           | ${undefined}        | ${false}        | ${''}                | ${'/question-2'}
    ${'CR skips q4 when on q3 with rule set to true'} | ${3}           | ${{ skipQ4: true }} | ${false}        | ${''}                | ${'/question-5'}
    ${'CR goes to target when target is set'}         | ${8}           | ${undefined}        | ${false}        | ${'/change-options'} | ${'/change-options'}
  `(
    '$path $description',
    ({ questionNumber, navRules, isAnswerChanged, target, expected }) => {
      const result = getNextPage(
        questionNumber,
        navRules,
        isAnswerChanged,
        target,
      );
      expect(result).toBe(expected);
    },
  );
});
