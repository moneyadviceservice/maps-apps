import { FieldType } from 'types/register';

import { validateIRN } from '../validateIRN';
import { validateFormFields } from './validateFormFields';

jest.mock('../validateIRN');

const mockedValidateIRN = validateIRN as jest.MockedFunction<
  typeof validateIRN
>;

describe('validateFormFields', () => {
  const mockFcaNumber = 'abcdef';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty Values, Required Flags & hideErrorWhen', () => {
    test.each`
      value        | type          | required | customValidation                                                                 | expectedResult
      ${''}        | ${'text'}     | ${true}  | ${undefined}                                                                     | ${{ error: 'required' }}
      ${'   '}     | ${'text'}     | ${true}  | ${undefined}                                                                     | ${{ error: 'required' }}
      ${null}      | ${'email'}    | ${true}  | ${undefined}                                                                     | ${{ error: 'required' }}
      ${undefined} | ${'phone'}    | ${true}  | ${undefined}                                                                     | ${{ error: 'required' }}
      ${false}     | ${'checkbox'} | ${true}  | ${undefined}                                                                     | ${{ error: 'required' }}
      ${''}        | ${'text'}     | ${false} | ${undefined}                                                                     | ${{ ok: true }}
      ${false}     | ${'checkbox'} | ${false} | ${undefined}                                                                     | ${{ ok: true }}
      ${null}      | ${'text'}     | ${true}  | ${{ hideErrorWhen: { relatedFieldIsInvalid: true, relatedFieldKey: 'parent' } }} | ${{ error: 'required', hideErrorWhen: { relatedFieldIsInvalid: true, relatedFieldKey: 'parent' } }}
    `(
      'returns $expectedResult when value="$value", type=$type, required=$required',
      async ({ value, type, required, customValidation, expectedResult }) => {
        const payload = {
          testField: {
            value,
            type: type as FieldType,
            required,
            customValidation,
          },
        };

        const result = await validateFormFields(payload, mockFcaNumber);

        expect(result.fields.testField).toEqual(expectedResult);
      },
    );
  });

  describe('Format & Regex Validation', () => {
    test.each`
      type          | value                 | expectedOk
      ${'email'}    | ${'test@example.com'} | ${true}
      ${'email'}    | ${'not-an-email'}     | ${false}
      ${'phone'}    | ${'+44 7123 456789'}  | ${true}
      ${'phone'}    | ${'abc123'}           | ${false}
      ${'url'}      | ${'https://a.com'}    | ${true}
      ${'url'}      | ${'not-a-url'}        | ${false}
      ${'postcode'} | ${'SW1A 1AA'}         | ${true}
      ${'postcode'} | ${'12345'}            | ${false}
      ${'hour_min'} | ${'09:00'}            | ${true}
      ${'hour_min'} | ${'23:59'}            | ${true}
      ${'hour_min'} | ${'24:00'}            | ${true}
      ${'hour_min'} | ${'25:00'}            | ${false}
      ${'hour_min'} | ${'12:60'}            | ${false}
      ${'hour_min'} | ${'invalid'}          | ${false}
    `(
      'validates $type format: "$value" -> expected ok status: $expectedOk',
      async ({ type, value, expectedOk }) => {
        const payload = {
          testField: {
            value,
            type: type as FieldType,
            required: true,
          },
        };

        const result = await validateFormFields(payload, mockFcaNumber);

        if (expectedOk) {
          expect(result.fields.testField).toEqual({ ok: true });
        } else {
          expect(result.fields.testField).toEqual({ error: 'invalid' });
        }
      },
    );
  });

  describe('Custom Comparison Validation', () => {
    test.each`
      value       | compareToValue | validationType   | expectedResult
      ${'10:00'}  | ${'12:00'}     | ${'lessThan'}    | ${{ ok: true }}
      ${'12:00'}  | ${'10:00'}     | ${'lessThan'}    | ${{ error: 'custom_error' }}
      ${'17:00'}  | ${'15:00'}     | ${'greaterThan'} | ${{ ok: true }}
      ${'15:00'}  | ${'17:00'}     | ${'greaterThan'} | ${{ error: 'custom_error' }}
      ${'10:00'}  | ${'10:00'}     | ${'lessThan'}    | ${{ error: 'custom_error' }}
      ${'ValueA'} | ${'ValueB'}    | ${undefined}     | ${{ ok: true }}
    `(
      'returns $expectedResult when value "$value" is compared to "$compareToValue" using "$validationType"',
      async ({ value, compareToValue, validationType, expectedResult }) => {
        const payload = {
          testField: {
            value,
            type: 'text' as FieldType,
            required: true,
            customValidation: {
              compareToValue,
              validationType,
            },
          },
        };

        const result = await validateFormFields(payload, mockFcaNumber);

        expect(result.fields.testField).toEqual(expectedResult);
      },
    );
  });

  describe('Specific IRN Validation', () => {
    it('should return ok: true when the IRN is valid', async () => {
      mockedValidateIRN.mockResolvedValueOnce(true);

      const payload = {
        individualReferenceNumber: {
          value: 'ABC12345',
          type: 'text' as FieldType,
          required: true,
        },
      };

      const result = await validateFormFields(payload, mockFcaNumber);

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
          required: true,
        },
      };

      const result = await validateFormFields(payload, mockFcaNumber);

      expect(result.fields.individualReferenceNumber).toEqual({
        error: 'invalid',
      });
      expect(result.ok).toBe(false);
    });
  });

  describe('Aggregate Form Validation State', () => {
    it('should return ok: true when all fields in a multi-field payload are valid', async () => {
      const payload = {
        mail: {
          value: 'test@example.com',
          type: 'email' as FieldType,
          required: true,
        },
        phone: {
          value: '07123456789',
          type: 'phone' as FieldType,
          required: true,
        },
        surname: { value: '', type: 'text' as FieldType, required: false },
      };

      const result = await validateFormFields(payload, mockFcaNumber);

      expect(result.ok).toBe(true);
      expect(result.error).toBe(false);
      expect(result.fields.mail).toEqual({ ok: true });
      expect(result.fields.phone).toEqual({ ok: true });
      expect(result.fields.surname).toEqual({ ok: true });
    });

    it('should return ok: false if even one field in the payload fails', async () => {
      const payload = {
        email: {
          value: 'valid@test.com',
          type: 'email' as FieldType,
          required: true,
        },
        phone: {
          value: 'invalid',
          type: 'phone' as FieldType,
          required: true,
        },
      };

      const result = await validateFormFields(payload, mockFcaNumber);

      expect(result.ok).toBe(false);
      expect(result.error).toBe(true);
      expect(result.fields.email).toEqual({ ok: true });
      expect(result.fields.phone).toEqual({ error: 'invalid' });
    });
  });
});
