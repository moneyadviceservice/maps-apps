import { transformData } from '.';
import { QUESTION_PREFIX } from '../../../../CONSTANTS';

describe('transformData', () => {
  it('should transform data without error', () => {
    const error = false;
    const data = {
      [QUESTION_PREFIX + '1']: '0',
    };
    const question = 'question-2';

    const result = transformData(error, data, question);

    expect(result).toStrictEqual({ [QUESTION_PREFIX + '1']: '0' });
  });

  it('should add error to data if there is an error', () => {
    const error = true;
    const data = {
      [QUESTION_PREFIX + '1']: '0',
    };
    const question = 'question-2';

    const result = transformData(error, data, question);

    expect(result).toStrictEqual({
      [QUESTION_PREFIX + '1']: '0',
      error: 'question-2',
    });
  });
});
