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

  it('maps a simple field with id to field_id', () => {
    mockedGetError.mockReturnValue('');
    const input = [{ id: '1', name: 'Name is required' }];
    const result = getErrors(input);
    expect(result).toEqual({ name_1: ['Name is required'] });
  });

  it('maps retireAge to retire_age_id', () => {
    mockedGetError.mockReturnValue('');
    const input = [{ id: 'a', retireAge: 'Enter a valid age' }];
    const result = getErrors(input);
    expect(result).toEqual({ retire_age_a: ['Enter a valid age'] });
  });

  it('maps gender to gender-male_id', () => {
    mockedGetError.mockReturnValue('');
    const input = [{ id: 'g', gender: 'Select a gender' }];
    const result = getErrors(input);
    expect(result).toEqual({ 'gender-male_g': ['Select a gender'] });
  });

  it('maps dob error to day_id when getErrorMessageByKey returns day-invalid', () => {
    mockedGetError.mockReturnValue('day-invalid');
    const input = [{ id: '2', dob: 'Day missing' }];
    const result = getErrors(input);
    expect(result).toEqual({ day_2: ['Day missing'] });
  });

  it('(with current implementation) maps year-invalid to month_id due to month check bug', () => {
    mockedGetError.mockReturnValue('year-invalid');
    const input = [{ id: '3', dob: 'Year invalid' }];
    const result = getErrors(input);
    // Current logic returns month_{id} because monthErrorKeys.includes('month-invalid') is always true
    expect(result).toEqual({ month_3: ['Year invalid'] });
  });

  it('uses plain field name when id is absent for non-dob fields', () => {
    mockedGetError.mockReturnValue('');
    const input = [{ name: 'Required' }];
    const result = getErrors(input);
    expect(result).toEqual({ name: ['Required'] });
  });

  it('accumulates multiple messages for the same generated key', () => {
    mockedGetError.mockReturnValue('');
    const input = [
      { id: '1', name: 'First message' },
      { id: '1', name: 'Second message' },
    ];
    const result = getErrors(input);
    expect(result).toEqual({ name_1: ['First message', 'Second message'] });
  });

  it('handles multiple fields in single item producing multiple keys', () => {
    mockedGetError.mockReturnValue('');
    const input = [{ id: '1', name: 'Name msg', retireAge: 'Retire msg' }];
    const result = getErrors(input);
    expect(result).toEqual({
      name_1: ['Name msg'],
      retire_age_1: ['Retire msg'],
    });
  });

  it('when id is undefined and dob processed, current logic produces month_undefined key', () => {
    mockedGetError.mockReturnValue('');
    const input = [{ dob: 'Invalid' }];
    const result = getErrors(input);
    // With id undefined and the current month-check logic, month_${id} resolves to 'month_undefined'
    expect(result).toEqual({ month_undefined: ['Invalid'] });
  });
});
