import { getNextPage } from '.';
import { DataPath } from 'types';

describe('getNextPage', () => {
  it.each`
    description                                       | error    | path                        | questionNumber | navRules            | isAnswerChanged | target               | expected
    ${'CR goes to next question when no rules set'}   | ${false} | ${DataPath.CreditRejection} | ${1}           | ${undefined}        | ${false}        | ${''}                | ${'/question-2'}
    ${'CR skips q4 when on q3 with rule set to true'} | ${false} | ${DataPath.CreditRejection} | ${3}           | ${{ skipQ4: true }} | ${false}        | ${''}                | ${'/question-5'}
    ${'CR goes to target when target is set'}         | ${false} | ${DataPath.CreditRejection} | ${8}           | ${undefined}        | ${false}        | ${'/change-options'} | ${'/change-options'}
    ${'PT goes to next question when no rules set'}   | ${false} | ${DataPath.PensionType}     | ${1}           | ${undefined}        | ${false}        | ${''}                | ${'/question-2'}
    ${'PT skips q2 when on q1 with rule set to true'} | ${false} | ${DataPath.PensionType}     | ${1}           | ${{ skipQ2: true }} | ${false}        | ${''}                | ${'/change-options'}
    ${'PT goes to target when target is set'}         | ${false} | ${DataPath.PensionType}     | ${4}           | ${undefined}        | ${false}        | ${'/change-options'} | ${'/change-options'}
    ${'stays on page when error is true'}             | ${true}  | ${DataPath.PensionType}     | ${1}           | ${undefined}        | ${false}        | ${''}                | ${'/question-1'}
    ${'goes to change-options when isAnswerChanged'}  | ${false} | ${DataPath.PensionType}     | ${1}           | ${undefined}        | ${true}         | ${''}                | ${'/change-options'}
  `(
    '$path $description',
    ({
      error,
      path,
      questionNumber,
      navRules,
      isAnswerChanged,
      target,
      expected,
    }) => {
      const result = getNextPage(
        error,
        path,
        questionNumber,
        navRules,
        isAnswerChanged,
        target,
      );
      expect(result).toBe(expected);
    },
  );
});
