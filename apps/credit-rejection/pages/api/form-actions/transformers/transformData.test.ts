import { QUESTION_PREFIX } from 'CONSTANTS';
import { transformData } from '.';

describe('transformData', () => {
  it('should transform data for CreditRejection path (removes any skipped Q data)', () => {
    const error = false;
    const navRules = {
      CONTINUE: true,
      skipQ2: true,
    };
    const data = {
      [QUESTION_PREFIX + 1]: '0',
      [QUESTION_PREFIX + 2]: '1',
    };
    const question = 'question-1';

    const result = transformData(error, navRules, data, question);

    expect(result).toStrictEqual({
      [QUESTION_PREFIX + 1]: '0',
      [QUESTION_PREFIX + 2]: '1',
    });
  });
});
