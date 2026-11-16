import { getNextPage } from '.';

describe('getNextPage', () => {
  it.each`
    description                                                         | error    | questionNumber | isChangedAnswer | navRules                  | target       | expected
    ${'should go to next question when no error'}                       | ${false} | ${1}           | ${false}        | ${undefined}              | ${''}        | ${'/question-2'}
    ${'should stay on current question when there is an error'}         | ${true}  | ${6}           | ${false}        | ${undefined}              | ${''}        | ${'/question-6'}
    ${'should go to /question-7 if navRules.redirectToQ7 is true'}      | ${false} | ${6}           | ${false}        | ${{ redirectToQ7: true }} | ${''}        | ${'/question-7'}
    ${'should go to /change-options if navRules.skipQ7 is true'}        | ${false} | ${6}           | ${false}        | ${{ skipQ7: true }}       | ${''}        | ${'/change-options'}
    ${'should go to /change-options if isAnswerChanged is true'}        | ${false} | ${6}           | ${true}         | ${undefined}              | ${''}        | ${'/change-options'}
    ${'should go to target if provided and no other condition matched'} | ${false} | ${5}           | ${false}        | ${undefined}              | ${'/custom'} | ${'/custom'}
    ${'should go to next question if no error, no navRules, no target'} | ${false} | ${3}           | ${false}        | ${undefined}              | ${''}        | ${'/question-4'}
  `(
    '$description',
    ({
      error,
      questionNumber,
      isChangedAnswer,
      navRules,
      target,
      expected,
    }) => {
      const result = getNextPage(
        error,
        questionNumber,
        navRules,
        isChangedAnswer,
        target,
      );
      expect(result).toBe(expected);
    },
  );
});
