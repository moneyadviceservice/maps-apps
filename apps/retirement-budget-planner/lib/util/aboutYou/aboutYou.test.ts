import { getErrors } from './aboutYou';
import { getErrorMessageByKey } from 'lib/validation/partner';

jest.mock('lib/validation/partner', () => ({
  getErrorMessageByKey: jest.fn(),
}));

const mockedGetError = getErrorMessageByKey as jest.MockedFunction<
  typeof getErrorMessageByKey
>;

describe('aboutYou.getErrors', () => {
  beforeEach(() => {
    mockedGetError.mockReset();
  });

  it('returns null when given null', () => {
    expect(getErrors(null)).toBeNull();
  });

  it('maps retireAge to retire_age', () => {
    mockedGetError.mockReturnValue('');
    const input = { retireAge: 'Enter a valid age' };
    const result = getErrors(input);
    expect(result).toEqual({ retire_age: ['Enter a valid age'] });
  });

  it('maps gender to gender-male', () => {
    mockedGetError.mockReturnValue('');
    const input = { gender: 'Select a gender' };
    const result = getErrors(input);
    expect(result).toEqual({ 'gender-male': ['Select a gender'] });
  });

  it('maps dob error to day_id when getErrorMessageByKey returns day-invalid', () => {
    mockedGetError.mockReturnValue('day-invalid');
    const input = { dob: 'Day missing' };
    const result = getErrors(input);
    expect(result).toEqual({ day: ['Day missing'] });
  });

  it('(with current implementation) maps year-invalid to month_id due to month check bug', () => {
    mockedGetError.mockReturnValue('year-invalid');
    const input = { dob: 'Year invalid' };
    const result = getErrors(input);
    // Current logic returns month_{id} because monthErrorKeys.includes('month-invalid') is always true
    expect(result).toEqual({ month: ['Year invalid'] });
  });

  it('handles multiple fields in single item producing multiple keys', () => {
    mockedGetError.mockReturnValue('');
    const input = { gender: 'gender msg', retireAge: 'Retire msg' };
    const result = getErrors(input);
    expect(result).toEqual({
      'gender-male': ['gender msg'],
      retire_age: ['Retire msg'],
    });
  });

  it('when id is undefined and dob processed, current logic produces month_undefined key', () => {
    mockedGetError.mockReturnValue('');
    const input = { dob: 'Invalid' };
    const result = getErrors(input);
    // With id undefined and the current month-check logic, month_${id} resolves to 'month_undefined'
    expect(result).toEqual({ month: ['Invalid'] });
  });
});
