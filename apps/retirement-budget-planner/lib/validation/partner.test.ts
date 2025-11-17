import { z } from 'zod';
import {
  NameSchema,
  validateName,
  PartnerSchema,
  formattedPartnerErrors,
  validatePartner,
  validateForm,
  getErrorMessageByKey,
  hasFieldError,
  partnerError,
  updatePartnerErrors,
  findPartnerNameError,
  hasNameError,
} from './partner';

jest.mock('lib/types/aboutYou', () => ({
  __esModule: true,

  Partner: {},
}));

const mockValidateDobEmpty = jest.fn();
const mockValidateDobFieldPresence = jest.fn();
const mockValidateDobInvalidDate = jest.fn();
const mockValidateDobAgeRange = jest.fn();

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
}));

const PARTNER_ID_1 = 1;
const PARTNER_ID_2 = 2;
const VALID_NAME = 'John Doe';
const VALID_GENDER_MALE = 'male';
const VALID_AGE = '60';
const VALID_DOB = { day: '01', month: '01', year: '1990' };

describe('NameSchema', () => {
  test('accepts valid name and trims whitespace', () => {
    const result = NameSchema.safeParse('  Jane Doe  ');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('Jane Doe');
    }
  });

  test('rejects empty string -> "name-generic"', () => {
    const result = NameSchema.safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === 'name-generic'),
      ).toBe(true);
    }
  });

  test('rejects too short/too long -> "name-length"', () => {
    const short = NameSchema.safeParse('J');
    const long = NameSchema.safeParse('J'.repeat(31));
    expect(short.success).toBe(false);
    expect(long.success).toBe(false);
    if (!short.success && !long.success) {
      expect(short.error.issues[0].message).toBe('name-length');
      expect(long.error.issues[0].message).toBe('name-length');
    }
  });

  test('rejects invalid characters -> "name-invalid"', () => {
    const result = NameSchema.safeParse('John123');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('name-invalid');
    }
  });
});

describe('validateName', () => {
  test('returns null when name is valid', () => {
    const errors = validateName(PARTNER_ID_1, VALID_NAME, {});
    expect(errors).toBeNull();
  });

  test('returns errors with first issue and preserves existing errors', () => {
    const existing = { gender: 'gender-generic' };
    const invalidName = 'J';
    const errors = validateName(PARTNER_ID_1, invalidName, existing);
    expect(errors).not.toBeNull();
    expect(errors).toMatchObject({
      id: String(PARTNER_ID_1),
      name: 'name-length',
      gender: 'gender-generic',
    });
  });
});

describe('PartnerSchema (DOB superRefine) with mocked dobValidation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const basePartner = {
    id: PARTNER_ID_1,
    name: VALID_NAME,
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
    name: VALID_NAME,
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
      name: '',
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
        name: 'name-generic',
        dob: 'dob-error',
        gender: 'gender-generic',
        retireAge: 'retire-age-range',
      });
    }
  });
});

describe('validatePartner & validateForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateDobEmpty.mockReturnValue(false);
    mockValidateDobFieldPresence.mockReturnValue(false);
    mockValidateDobInvalidDate.mockReturnValue(false);
    mockValidateDobAgeRange.mockReturnValue(undefined);
  });

  const validPartner = {
    id: PARTNER_ID_1,
    name: VALID_NAME,
    dob: VALID_DOB,
    gender: VALID_GENDER_MALE,
    retireAge: VALID_AGE,
  };

  const invalidPartner = {
    id: PARTNER_ID_2,
    name: '',
    dob: VALID_DOB,
    gender: VALID_GENDER_MALE,
    retireAge: VALID_AGE,
  };

  test('validatePartner returns null for valid partner', () => {
    const res = validatePartner(validPartner as any);
    expect(res).toBeNull();
  });

  test('validatePartner returns field errors for invalid partner', () => {
    const res = validatePartner(invalidPartner as any);
    expect(res).not.toBeNull();
    expect(res).toMatchObject({
      name: 'name-generic',
      id: '',
      dob: '',
      gender: '',
      retireAge: '',
    });
  });

  test('validateForm returns only invalid partners with stringified id', () => {
    const res = validateForm([validPartner as any, invalidPartner as any]);
    expect(res).toHaveLength(1);
    expect(res[0]).toMatchObject({
      id: String(PARTNER_ID_2),
      name: 'name-generic',
    });
  });
});

describe('getErrorMessageByKey', () => {
  test('returns message for existing key', () => {
    const map = { name: 'name-generic' };
    expect(getErrorMessageByKey('name', map)).toBe('name-generic');
  });
});

describe('hasFieldError', () => {
  test('returns empty array when no error', () => {
    const res = hasFieldError('name', { name: '' });
    expect(Array.isArray(res)).toBe(true);
    expect(res).toHaveLength(0);
  });

  test('returns array with one ErrorType-like item when error string present', () => {
    const res = hasFieldError('name', { name: 'name-generic' });
    expect(res).toHaveLength(1);
    expect(typeof res[0]).toBe('object');
  });
});

describe('partnerError', () => {
  test('returns null when formError is null', () => {
    expect(partnerError(null, PARTNER_ID_1)).toBeNull();
  });

  test('returns matching partner errors by id', () => {
    const list = [
      { id: String(PARTNER_ID_1), name: 'name-generic' },
      { id: String(PARTNER_ID_2), name: '' },
    ];
    const found = partnerError(list as any, PARTNER_ID_1);
    expect(found).toEqual({ id: '1', name: 'name-generic' });
  });

  test('returns null when no matching id found', () => {
    const list = [{ id: '99', name: 'x' }];
    expect(partnerError(list as any, PARTNER_ID_1)).toBeNull();
  });
});

describe('updatePartnerErrors', () => {
  const ERR_1 = { id: '1', name: 'name-generic' };
  const ERR_2 = { id: '2', name: 'name-length' };
  const ERR_3 = { id: '3', name: 'name-invalid' };

  test('returns new array when formErrors is null', () => {
    const res = updatePartnerErrors(null, ERR_1);
    expect(res).toEqual([ERR_1]);
  });

  test('appends when single existing and new id === 2', () => {
    const res = updatePartnerErrors([ERR_1], ERR_2);
    expect(res).toEqual([ERR_1, ERR_2]);
  });

  test('replaces matching id entry', () => {
    const res = updatePartnerErrors([ERR_1, ERR_3], {
      ...ERR_1,
      name: 'updated',
    });
    expect(res).toEqual([{ id: '1', name: 'updated' }, ERR_3]);
  });

  test('keeps non-matching entries unchanged', () => {
    const res = updatePartnerErrors([ERR_1, ERR_3], ERR_2);
    expect(res).toEqual([ERR_1, ERR_3]);
  });

  test('replaces undefined slots with partnerErrors', () => {
    const res = updatePartnerErrors([undefined, ERR_3], ERR_1);
    expect(res).toEqual([ERR_1, ERR_3]);
  });
});

describe('findPartnerNameError & hasNameError', () => {
  const partners = [
    { id: 1, name: '', dob: VALID_DOB, gender: 'male', retireAge: '60' },
    { id: 2, name: 'J', dob: VALID_DOB, gender: 'female', retireAge: '60' },
    { id: 3, name: 'John123', dob: VALID_DOB, gender: 'male', retireAge: '60' },
    {
      id: 4,
      name: 'Valid Name',
      dob: VALID_DOB,
      gender: 'female',
      retireAge: '60',
    },
    {
      id: 5,
      name: 'X'.repeat(31),
      dob: VALID_DOB,
      gender: 'female',
      retireAge: '60',
    },
  ];

  test('returns array with entries for invalid names only', () => {
    const res = findPartnerNameError(partners as any);

    expect(res).toHaveLength(partners.length);
    expect(res[0]).toEqual({ id: '1', name: 'name-generic' });
    expect(res[1]).toEqual({ id: '2', name: 'name-length' });
    expect(res[2]).toEqual({ id: '3', name: 'name-invalid' });
    expect(res[3]).toBeUndefined();
    expect(res[4]).toEqual({ id: '5', name: 'name-length' });
  });

  test('hasNameError returns true when any name invalid, false otherwise', () => {
    expect(hasNameError(partners as any)).toBe(true);
    const allValid = [
      {
        id: 1,
        name: 'Jane Doe',
        dob: VALID_DOB,
        gender: 'female',
        retireAge: '65',
      },
    ];
    expect(hasNameError(allValid as any)).toBe(false);
  });
});
