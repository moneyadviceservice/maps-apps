import {
  PartnerSchema,
  validateForm,
  formattedPartnerErrors,
  getErrorMessageByKey,
  hasFieldError,
} from './partner';

describe('partner validation', () => {
  const currentYear = new Date().getFullYear();

  const ERROR_DOB_DAY = 'Error: You must enter your day of birth';
  const ERROR_GENDER = 'Error: Please enter your gender to continue.';
  const ERROR_CANT_BE_BLANK = "Error: Can't be blank";
  const NAME_REQUIRED = 'Name is required';
  const RETIREMENT_REQUIRED = 'Retirement age is required';

  const makeValidPartner = () => ({
    id: 1,
    name: 'Alice',
    dob: { day: '1', month: '1', year: String(currentYear - 35) },
    gender: 'female',
    retireAge: '65',
  });

  test('valid partner passes validation (validateForm returns null)', () => {
    const partner = makeValidPartner();
    const result = validateForm(partner as any);
    expect(result).toBeNull();
  });

  test('missing name returns name error', () => {
    const partner = { ...makeValidPartner(), name: '' };
    const errors = validateForm(partner as any);
    expect(errors).not.toBeNull();
    expect(errors?.name).toBe(NAME_REQUIRED);
    expect(getErrorMessageByKey('name', errors as any)).toBe(NAME_REQUIRED);
    expect(hasFieldError('name', errors as any)).toHaveLength(1);
  });

  test('invalid gender returns gender error', () => {
    const partner = { ...makeValidPartner(), gender: 'other' };
    const errors = validateForm(partner as any);
    expect(errors).not.toBeNull();
    expect(errors?.gender).toBe(ERROR_GENDER);
    expect(getErrorMessageByKey('gender', errors as any)).toBe(ERROR_GENDER);
    expect(hasFieldError('gender', errors as any)).toHaveLength(1);
  });

  test('retireAge out of allowed range returns refine message', () => {
    const partner = { ...makeValidPartner(), retireAge: '49' };
    const errors = validateForm(partner as any);
    expect(errors).not.toBeNull();
    expect(errors?.retireAge).toBe(ERROR_CANT_BE_BLANK);
    expect(getErrorMessageByKey('retireAge', errors as any)).toBe(
      ERROR_CANT_BE_BLANK,
    );
    expect(hasFieldError('retireAge', errors as any)).toHaveLength(1);
  });

  test('retireAge empty returns required message', () => {
    const partner = { ...makeValidPartner(), retireAge: '' };
    const errors = validateForm(partner as any);
    expect(errors).not.toBeNull();
    expect(errors?.retireAge).toBe(RETIREMENT_REQUIRED);
    expect(getErrorMessageByKey('retireAge', errors as any)).toBe(
      RETIREMENT_REQUIRED,
    );
    expect(hasFieldError('retireAge', errors as any)).toHaveLength(1);
  });

  test('dob missing produces a schema-level issue (superRefine) and formattedPartnerErrors maps it to dob key', () => {
    const partner = {
      ...makeValidPartner(),
      dob: { day: '', month: '', year: '' },
    };
    const parsed = PartnerSchema.safeParse(partner);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.message);
      expect(issues).toContain(ERROR_DOB_DAY);

      const mapped = formattedPartnerErrors(parsed.error);

      expect(mapped.dob).toBe(ERROR_DOB_DAY);

      const errors = validateForm(partner as any);
      expect(errors).not.toBeNull();
    }
  });

  test('dob under 18 produces superRefine issue', () => {
    const partner = {
      ...makeValidPartner(),
      dob: { day: '1', month: '1', year: String(currentYear - 17) },
    };
    const parsed = PartnerSchema.safeParse(partner);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.message === ERROR_DOB_DAY)).toBe(
        true,
      );
      const mapped = formattedPartnerErrors(parsed.error);

      expect(mapped.dob).toBe(ERROR_DOB_DAY);
    }
  });

  test('dob over 100 produces superRefine issue', () => {
    const partner = {
      ...makeValidPartner(),
      dob: { day: '1', month: '1', year: String(currentYear - 101) },
    };
    const parsed = PartnerSchema.safeParse(partner);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.message === ERROR_DOB_DAY)).toBe(
        true,
      );
      const mapped = formattedPartnerErrors(parsed.error);
      expect(mapped.dob).toBe(ERROR_DOB_DAY);
    }
  });

  test('formattedPartnerErrors maps field-level issues (e.g., name)', () => {
    const partner = { ...makeValidPartner(), name: '' };
    const parsed = PartnerSchema.safeParse(partner);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.path[0] === 'name')).toBe(true);
      const mapped = formattedPartnerErrors(parsed.error);
      expect(mapped.name).toBe(NAME_REQUIRED);

      expect(mapped.gender).toBe('');
      expect(mapped.retireAge).toBe('');
    }
  });

  test('getErrorMessageByKey and hasFieldError return undefined/empty for absent keys', () => {
    const partner = makeValidPartner();
    const errors = validateForm(partner as any);
    expect(errors).toBeNull();

    const msg = getErrorMessageByKey('nonexistent', errors as any);
    expect(msg).toBeUndefined();
    expect(hasFieldError('nonexistent', errors as any)).toHaveLength(0);
  });
});
