import { transformData } from '.';
import { DataPath } from 'types';
import { QUESTION_PREFIX } from 'CONSTANTS';

describe('transformData', () => {
  it('should transform data for PensionType path (removes any skipped Q data)', () => {
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
    const path = DataPath.PensionType;

    const result = transformData(error, navRules, data, question, path);

    expect(result).toStrictEqual({ [QUESTION_PREFIX + 1]: '0' });
  });
});
