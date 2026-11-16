import { getNextPage } from '.';

describe('getNextPage', () => {
  it.each`
    description                                       | error    | questionNumber | navRules            | expected
    ${'CR goes to next question when no rules set'}   | ${false} | ${1}           | ${undefined}        | ${'question-2'}
    ${'CR skips q4 when on q3 with rule set to true'} | ${false} | ${3}           | ${{ skipQ4: true }} | ${'debtline-refer'}
  `('$path $description', ({ error, questionNumber, navRules, expected }) => {
    const result = getNextPage(error, questionNumber, navRules);
    expect(result).toBe(expected);
  });
});
