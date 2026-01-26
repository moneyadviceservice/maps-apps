import { z } from 'zod';
import {
  PartnerSchema,
  formattedPartnerErrors,
  validatePartner,
  getErrorMessageByKey,
  hasFieldError,
} from './partner';

jest.mock('lib/types/aboutYou', () => ({
  __esModule: true,

  Partner: {},
}));

const mockValidateDobEmpty = jest.fn();
const mockValidateDobFieldPresence = jest.fn();
const mockValidateDobInvalidDate = jest.fn();
const mockValidateDobAgeRange = jest.fn();
const mockGetAge = jest.fn();

jest.mock('./dobValidation', () => ({
  __esModule: true,
  validateDobEmpty: (dob: unknown, ctx: z.RefinementCtx) =>
    mockValidateDobEmpty(dob, ctx),
  validateDobFieldPresence: (dob: unknown, ctx: z.RefinementCtx) =>
    mockValidateDobFieldPresence(dob, ctx),
  validateDobInvalidDate: (dob: unknown, ctx: z.RefinementCtx) =>
    mockValidateDobInvalidDate(dob, ctx),
  validateDobAgeRange: (dob: unknown, ctx: z.RefinementCtx) =>
    mockValidateDobAgeRange(dob, ctx),
  getAge: (dob: unknown) => mockGetAge(dob),
}));

const PARTNER_ID_1 = 1;
const VALID_GENDER_MALE = 'male';
const VALID_AGE = '60';
const VALID_DOB = { day: '01', month: '01', year: '1990' };

describe('PartnerSchema (DOB superRefine) with mocked dobValidation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const basePartner = {
    id: PARTNER_ID_1,
    dob: VALID_DOB,
    gender: VALID_GENDER_MALE,
    retireAge: VALID_AGE,
  };

  test('early-exits when validateDobEmpty returns true and adds its issue', () => {
    mockValidateDobEmpty.mockImplementation((_dob, ctx) => {
      ctx.addIssue({ code: 'custom', message: 'dob-empty' });
      return true;
    });
    mockValidateDobFieldPresence.mockReturnValue(false);
    mockValidateDobInvalidDate.mockReturnValue(false);

    const result = PartnerSchema.safeParse(basePartner);
    expect(result.success).toBe(false);

    expect(mockValidateDobFieldPresence).not.toHaveBeenCalled();
    expect(mockValidateDobInvalidDate).not.toHaveBeenCalled();

    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('dob-empty');
    }
  });

  test('early-exits when validateDobFieldPresence returns true and adds its issue', () => {
    mockValidateDobEmpty.mockReturnValue(false);
    mockValidateDobFieldPresence.mockImplementation((_dob, ctx) => {
      ctx.addIssue({ code: 'custom', message: 'dob-fields' });
      return true;
    });
    mockValidateDobInvalidDate.mockReturnValue(false);

    const result = PartnerSchema.safeParse(basePartner);
    expect(result.success).toBe(false);

    expect(mockValidateDobInvalidDate).not.toHaveBeenCalled();

    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('dob-fields');
    }
  });

  test('early-exits when validateDobInvalidDate returns true and adds its issue', () => {
    mockValidateDobEmpty.mockReturnValue(false);
    mockValidateDobFieldPresence.mockReturnValue(false);
    mockValidateDobInvalidDate.mockImplementation((_dob, ctx) => {
      ctx.addIssue({ code: 'custom', message: 'dob-invalid' });
      return true;
    });

    const result = PartnerSchema.safeParse(basePartner);
    expect(result.success).toBe(false);

    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('dob-invalid');
    }
  });

  test('calls validateDobAgeRange when others are false and adds issue', () => {
    mockValidateDobEmpty.mockReturnValue(false);
    mockValidateDobFieldPresence.mockReturnValue(false);
    mockValidateDobInvalidDate.mockReturnValue(false);
    mockValidateDobAgeRange.mockImplementation((_dob, ctx) => {
      ctx.addIssue({ code: 'custom', message: 'dob-age-range' });
    });

    const result = PartnerSchema.safeParse(basePartner);
    expect(result.success).toBe(false);
    expect(mockValidateDobAgeRange).toHaveBeenCalledTimes(1);

    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('dob-age-range');
    }
  });

  test('accepts valid partner when DOB validators do not add issues', () => {
    mockValidateDobEmpty.mockReturnValue(false);
    mockValidateDobFieldPresence.mockReturnValue(false);
    mockValidateDobInvalidDate.mockReturnValue(false);
    mockValidateDobAgeRange.mockReturnValue(undefined);

    const result = PartnerSchema.safeParse(basePartner);
    expect(result.success).toBe(true);
  });
});

describe('PartnerSchema (other fields)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateDobEmpty.mockReturnValue(false);
    mockValidateDobFieldPresence.mockReturnValue(false);
    mockValidateDobInvalidDate.mockReturnValue(false);
    mockValidateDobAgeRange.mockReturnValue(undefined);
  });

  const valid = {
    id: PARTNER_ID_1,
    dob: VALID_DOB,
    gender: 'FEMALE',
    retireAge: '55',
  };

  test('id must be >= 1', () => {
    const result = PartnerSchema.safeParse({ ...valid, id: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('id');
    }
  });

  test('gender invalid -> "gender-generic"', () => {
    const result = PartnerSchema.safeParse({ ...valid, gender: 'unknown' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('gender-generic');
    }
  });

  test('gender empty -> "gender-generic"', () => {
    const result = PartnerSchema.safeParse({ ...valid, gender: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('gender-generic');
    }
  });

  test('retireAge empty -> "retire-age-empty"', () => {
    const result = PartnerSchema.safeParse({ ...valid, retireAge: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === 'retire-age-empty'),
      ).toBe(true);
    }
  });

  test('retireAge non-numeric/out-of-range -> "retire-age-range"', () => {
    const nonNumeric = PartnerSchema.safeParse({ ...valid, retireAge: 'abc' });
    const tooYoung = PartnerSchema.safeParse({ ...valid, retireAge: '54' });
    const tooOld = PartnerSchema.safeParse({ ...valid, retireAge: '100' });

    expect(nonNumeric.success).toBe(false);
    expect(tooYoung.success).toBe(false);
    expect(tooOld.success).toBe(false);
    if (!nonNumeric.success && !tooYoung.success && !tooOld.success) {
      expect(nonNumeric.error.issues[0].message).toBe('retire-age-range');
      expect(tooYoung.error.issues[0].message).toBe('retire-age-range');
      expect(tooOld.error.issues[0].message).toBe('retire-age-range');
    }
  });

  test('valid partner passes', () => {
    const result = PartnerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});

describe('formattedPartnerErrors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateDobEmpty.mockImplementation((_dob, ctx) => {
      ctx.addIssue({ code: 'custom', message: 'dob-error' });
      return true;
    });
  });

  test('maps first issue per field and ignores subsequent issues for same field', () => {
    const invalidPartner = {
      id: 0,
      dob: { day: '01', month: '13', year: '1990' },
      gender: '',
      retireAge: '10',
    };

    const result = PartnerSchema.safeParse(invalidPartner);
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = formattedPartnerErrors(result.error);

      expect(fieldErrors).toEqual({
        id: expect.any(String),
        dob: 'dob-error',
        gender: 'gender-generic',
        retireAge: 'retire-age-range',
      });
    }
  });
});

describe('validatePartner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateDobEmpty.mockReturnValue(false);
    mockValidateDobFieldPresence.mockReturnValue(false);
    mockValidateDobInvalidDate.mockReturnValue(false);
    mockValidateDobAgeRange.mockReturnValue(undefined);
  });

  const validPartner = {
    id: PARTNER_ID_1,
    dob: VALID_DOB,
    gender: VALID_GENDER_MALE,
    retireAge: VALID_AGE,
  };

  const invalidPartner = {
    id: 2,
    dob: { day: '', month: '', year: '' },
    gender: '',
    retireAge: '',
  };

  test('validatePartner returns null for valid partner', () => {
    const res = validatePartner(validPartner as any);
    expect(res).toBeNull();
  });

  test('validatePartner returns field errors for invalid partner', () => {
    const res = validatePartner(invalidPartner as any);
    expect(res).not.toBeNull();
  });
});

describe('getErrorMessageByKey', () => {
  test('returns message for existing key', () => {
    const map = { dob: 'dob-invalid' };
    expect(getErrorMessageByKey('dob', map)).toBe('dob-invalid');
  });
});

describe('hasFieldError', () => {
  test('returns empty array when no error', () => {
    const res = hasFieldError('retireAge', { retireAge: '' });
    expect(Array.isArray(res)).toBe(true);
    expect(res).toHaveLength(0);
  });

  test('returns array with one ErrorType-like item when error string present', () => {
    const res = hasFieldError('retireAge', { retireAge: 'retire-age-range' });
    expect(res).toHaveLength(1);
    expect(typeof res[0]).toBe('object');
  });
});

describe('retireAge validation with dob', () => {
  test('fails when retireAge is less than current age', () => {
    mockGetAge.mockReturnValue(70);
    const result = PartnerSchema.safeParse({
      id: 1,
      dob: {
        day: '01',
        month: '01',
        year: '1950',
      },
      gender: 'male',
      retireAge: '55',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'retire-age-less-than-current-age',
            path: ['retireAge'],
            code: 'custom',
          }),
        ]),
      );
    }
  });
});
