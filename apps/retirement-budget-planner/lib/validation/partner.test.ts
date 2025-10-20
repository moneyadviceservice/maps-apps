import { validateForm, getErrorMessageByKey, hasFieldError } from './partner';

jest.mock('./dobValidation', () => ({
  validateDobAgeRange: jest
    .fn()
    .mockImplementation((_dob: unknown, _ctx: any) => {}),
  validateDobEmpty: jest
    .fn()
    .mockImplementation((_dob: unknown, _ctx: any) => false),
  validateDobFieldPresence: jest
    .fn()
    .mockImplementation((_dob: unknown, _ctx: any) => false),
}));

describe('partner validation', () => {
  const baseValidPartner = {
    id: 1,
    name: 'Alice Example',
    dob: { day: '1', month: '1', year: '1980' },
    gender: 'female',
    retireAge: '65',
  };

  test('valid partner returns null', () => {
    const result = validateForm(baseValidPartner as any);
    expect(result).toBeNull();
  });

  test('empty retireAge returns retire-age-empty error', () => {
    const partner = { ...baseValidPartner, retireAge: '' };
    const errors = validateForm(partner as any);
    expect(errors).not.toBeNull();
    expect(
      getErrorMessageByKey(
        'retireAge',
        errors as Record<string, string> | null,
      ),
    ).toBe('retire-age-empty');
    expect(
      hasFieldError('retireAge', errors as Record<string, string> | null)
        .length,
    ).toBeGreaterThan(0);
  });

  test('retireAge out of range returns retire-age-range error', () => {
    const partner = { ...baseValidPartner, retireAge: '49' }; // below allowed range
    const errors = validateForm(partner as any);
    expect(errors).not.toBeNull();
    expect(
      getErrorMessageByKey(
        'retireAge',
        errors as Record<string, string> | null,
      ),
    ).toBe('retire-age-range');
  });

  test('name too long returns name-generic error', () => {
    const longName = 'a'.repeat(51);
    const partner = { ...baseValidPartner, name: longName };
    const errors = validateForm(partner as any);
    expect(errors).not.toBeNull();
    expect(
      getErrorMessageByKey('name', errors as Record<string, string> | null),
    ).toBe('name-generic');
    expect(
      hasFieldError('name', errors as Record<string, string> | null).length,
    ).toBeGreaterThan(0);
  });

  test('invalid gender returns gender-generic error', () => {
    const partner = { ...baseValidPartner, gender: 'other' };
    const errors = validateForm(partner as any);
    expect(errors).not.toBeNull();
    expect(
      getErrorMessageByKey('gender', errors as Record<string, string> | null),
    ).toBe('gender-generic');
    expect(
      hasFieldError('gender', errors as Record<string, string> | null).length,
    ).toBeGreaterThan(0);
  });

  test('formattedPartnerErrors produces at most one message per field', () => {
    const partner = {
      id: 0,
      name: '',
      dob: {},
      gender: '',
      retireAge: '',
    };

    const errors = validateForm(partner as any);
    expect(errors).not.toBeNull();

    const keys = ['id', 'name', 'dob', 'gender', 'retireAge'] as const;
    for (const key of keys) {
      const msg = (errors as Record<string, string>)[key];
      expect(typeof msg).toBe('string');
      if (key === 'dob') {
        expect(msg === '' || typeof msg === 'string').toBeTruthy();
      } else {
        expect(msg).not.toBe('');
      }
    }
  });

  test('getErrorMessageByKey returns undefined for missing keys and hasFieldError returns empty array', () => {
    const errors: Record<string, string> = { name: 'name-generic' };
    expect(getErrorMessageByKey('nonexistent', errors)).toBeUndefined();
    expect(getErrorMessageByKey('name', errors)).toBe('name-generic');

    expect(hasFieldError('name', errors).length).toBeGreaterThan(0);
    expect(hasFieldError('nonexistent', errors).length).toBe(0);

    expect(getErrorMessageByKey('name', null)).toBeUndefined();
    expect(hasFieldError('name', null).length).toBe(0);
    expect(hasFieldError('name', undefined).length).toBe(0);
  });
});
