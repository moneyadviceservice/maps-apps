import { z } from 'zod';

import { DateOfBirthData, validateDateOfBirth } from './validateDateOfBirth';

describe('validateDateOfBirth', () => {
  const refinementCtxMock = {
    addIssue: jest.fn(),
  };

  beforeEach(() => {
    refinementCtxMock.addIssue.mockClear();
  });

  it('should not throw an error for a valid date of birth', () => {
    const validData: DateOfBirthData = { day: '15', month: '3', year: '1990' };
    validateDateOfBirth(
      validData,
      refinementCtxMock as unknown as z.RefinementCtx,
    );

    expect(refinementCtxMock.addIssue).not.toHaveBeenCalled();
  });

  test.each`
    scenario                      | day      | month    | year                            | expectedMessage
    ${'missing fields'}           | ${''}    | ${''}    | ${''}                           | ${'generic'}
    ${'non-numeric values'}       | ${'abc'} | ${'xyz'} | ${'1990'}                       | ${'generic'}
    ${'out-of-range day'}         | ${'32'}  | ${'3'}   | ${'1990'}                       | ${'generic'}
    ${'out-of-range month'}       | ${'15'}  | ${'13'}  | ${'1990'}                       | ${'generic'}
    ${'out-of-range year'}        | ${'15'}  | ${'3'}   | ${'1800'}                       | ${'generic'}
    ${'future date'}              | ${'1'}   | ${'1'}   | ${new Date().getFullYear() + 1} | ${'generic'}
    ${'non-leap year Feb 29'}     | ${'29'}  | ${'2'}   | ${'2019'}                       | ${'generic'}
    ${'leap year Feb 29 (valid)'} | ${'29'}  | ${'2'}   | ${'2020'}                       | ${undefined}
    ${'April 31 (invalid)'}       | ${'31'}  | ${'4'}   | ${'2000'}                       | ${'generic'}
    ${'Feb 30 (invalid)'}         | ${'30'}  | ${'2'}   | ${'2000'}                       | ${'generic'}
    ${'minimum valid year'}       | ${'1'}   | ${'1'}   | ${'1900'}                       | ${undefined}
  `(
    'should throw an error for $scenario',
    ({ day, month, year, expectedMessage }) => {
      const testData: DateOfBirthData = { day, month, year };
      validateDateOfBirth(
        testData,
        refinementCtxMock as unknown as z.RefinementCtx,
      );

      if (expectedMessage) {
        expect(refinementCtxMock.addIssue).toHaveBeenCalledWith({
          code: z.ZodIssueCode.custom,
          path: ['dates'],
          message: expectedMessage,
        });
      } else {
        expect(refinementCtxMock.addIssue).not.toHaveBeenCalled();
      }
    },
  );
});
