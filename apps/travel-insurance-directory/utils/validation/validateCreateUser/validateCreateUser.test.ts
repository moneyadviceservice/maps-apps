import { FieldType } from 'types/register';

import { validateIRN } from '../validateIRN';
import { validateCreateUser } from './validateCreateUser';

jest.mock('../validateIRN');

const mockedValidateIRN = validateIRN as jest.MockedFunction<
  typeof validateIRN
>;

describe('validateCreateUser', () => {
  const mockFcaNumber = 'abcdef';

  it('should return ok: true when the IRN is valid', async () => {
    mockedValidateIRN.mockResolvedValueOnce(true);

    const payload = {
      individualReferenceNumber: {
        value: 'ABC12345',
        type: 'text' as FieldType,
      },
    };

    const result = await validateCreateUser(payload, mockFcaNumber);

    expect(result.fields.individualReferenceNumber).toEqual({ ok: true });
    expect(result.ok).toBe(true);
    expect(mockedValidateIRN).toHaveBeenCalledWith('ABC12345', mockFcaNumber);
  });

  it('should return error: invalid when the IRN is rejected by the API', async () => {
    mockedValidateIRN.mockResolvedValueOnce(false);

    const payload = {
      individualReferenceNumber: {
        value: 'INVALID99',
        type: 'text' as FieldType,
      },
    };

    const result = await validateCreateUser(payload, mockFcaNumber);

    expect(result.fields.individualReferenceNumber).toEqual({
      error: 'invalid',
    });
    expect(result.ok).toBe(false);
  });
  it('should return ok: true when all fields are valid', async () => {
    const payload = {
      mail: { value: 'test@example.com', type: 'email' as FieldType },
      phone: { value: '07123456789', type: 'phone' as FieldType },
      forename: { value: 'Jane', type: 'text' as FieldType },
      confirmation: { value: 'on', type: 'checkbox' as FieldType },
    };

    const result = await validateCreateUser(payload, mockFcaNumber);

    expect(result.ok).toBe(true);
    expect(result.error).toBe(false);
    expect(result.fields.mail).toEqual({ ok: true });
    expect(result.fields.phone).toEqual({ ok: true });
    expect(result.fields.forename).toEqual({ ok: true });
    expect(result.fields.confirmation).toEqual({ ok: true });
  });

  describe('Required Validation', () => {
    it('should catch empty strings as required errors', async () => {
      const payload = {
        firstName: { value: '  ', type: 'text' as FieldType },
      };
      const result = await validateCreateUser(payload, mockFcaNumber);
      expect(result.fields.firstName).toEqual({ error: 'required' });
      expect(result.ok).toBe(false);
      expect(result.error).toBe(true);
    });

    it('should catch unchecked checkboxes (false/empty) as required errors', async () => {
      const payload = {
        consent: { value: '', type: 'checkbox' as FieldType },
      };
      const result = await validateCreateUser(payload, mockFcaNumber);
      expect(result.fields.consent).toEqual({ error: 'required' });
    });
  });

  describe('Format Validation', () => {
    it('should invalidate incorrect email formats', async () => {
      const payload = {
        email: { value: 'not-an-email', type: 'email' as FieldType },
      };
      const result = await validateCreateUser(payload, mockFcaNumber);
      expect(result.fields.email).toEqual({ error: 'invalid' });
    });

    it('should invalidate incorrect phone formats', async () => {
      const payload = {
        phone: { value: 'abc123', type: 'phone' as FieldType },
      };
      const result = await validateCreateUser(payload, mockFcaNumber);
      expect(result.fields.phone).toEqual({ error: 'invalid' });
    });

    it('should validate international phone formats correctly', async () => {
      const payload = {
        phone: { value: '+44 7123 456789', type: 'phone' as FieldType },
      };
      const result = await validateCreateUser(payload, mockFcaNumber);
      expect(result.fields.phone).toEqual({ ok: true });
    });
  });

  it('should return ok: false if even one field fails', async () => {
    const payload = {
      email: { value: 'valid@test.com', type: 'email' as FieldType },
      phone: { value: 'invalid', type: 'phone' as FieldType },
    };
    const result = await validateCreateUser(payload, mockFcaNumber);
    expect(result.ok).toBe(false);
    expect(result.error).toBe(true);
  });
});
