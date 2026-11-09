import { page } from 'data/pages/register';
import { FormErrorsState, InputErrorTypes } from 'types/register';

import { getOtpErrorMessage } from '../getOtpErrorMessage';
import { generateSummaryErrors } from './generateSummaryErrors';

jest.mock('../getOtpErrorMessage');

describe('generateSummaryErrors', () => {
  const mockInputs = page.createAccountPage.inputs;

  const mockEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if formErrors is null or undefined', () => {
    expect(generateSummaryErrors(null, mockInputs, mockEmail)).toBeNull();
    expect(generateSummaryErrors(undefined, mockInputs, mockEmail)).toBeNull();
  });

  it('should ignore fields where object is empty', () => {
    const formErrors = {};

    const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

    expect(result).toEqual({});
  });

  it('should generate a standard error message for generic fields', () => {
    const formErrors = {
      givenName: { error: 'invalid' as InputErrorTypes },
    };

    const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

    expect(result).toEqual({
      givenName: ['Please enter a valid first name'],
    });
  });

  it('should use field-specific error message overrides when provided', () => {
    const formErrors = {
      cover_area: { error: 'required' as InputErrorTypes },
      otherField: { error: 'required' as InputErrorTypes },
    };
    const errorMessageOverrides = {
      cover_area: 'At least one region must be selected before continuing',
    };

    const result = generateSummaryErrors(
      formErrors,
      mockInputs,
      '',
      false,
      errorMessageOverrides,
    );

    expect(result?.cover_area).toEqual([
      'At least one region must be selected before continuing',
    ]);
    expect(result?.otherField).toEqual(['Please enter a valid otherfield']);
  });

  it('should generate the correct message for radio fields', () => {
    const formErrors = {
      randomRadioField: { error: 'required' as InputErrorTypes },
    };
    const isRadio = true;

    const result = generateSummaryErrors(formErrors, mockInputs, '', isRadio);

    expect(result).toEqual({
      randomRadioField: ['randomradiofield - Please select an option'],
    });
  });

  it('should include field labels in select option messages when provided', () => {
    const formErrors = {
      medical_screening_company: { error: 'required' as InputErrorTypes },
    };
    const fieldLabels = {
      medical_screening_company: 'Your medical screening provider',
    };

    const result = generateSummaryErrors(
      formErrors,
      mockInputs,
      '',
      true,
      undefined,
      fieldLabels,
    );

    expect(result).toEqual({
      medical_screening_company: [
        'Your medical screening provider - Please select an option',
      ],
    });
  });

  it('should use custom required messages for labelled select fields when provided', () => {
    const formErrors = {
      cover_area: { error: 'required' as InputErrorTypes },
    };
    const fieldLabels = {
      cover_area: 'Which regions do you offer cover for?',
    };
    const fieldRequiredMessages = {
      cover_area: 'At least one region must be selected before continuing',
    };

    const result = generateSummaryErrors(
      formErrors,
      mockInputs,
      '',
      true,
      undefined,
      fieldLabels,
      fieldRequiredMessages,
    );

    expect(result).toEqual({
      cover_area: [
        'Which regions do you offer cover for? - At least one region must be selected before continuing',
      ],
    });
  });

  it('should return a specific message for email_exists error', () => {
    const formErrors = {
      mail: { error: 'email_exists' as InputErrorTypes },
    };

    const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

    expect(result?.mail).toEqual(['This email address is already registered.']);
  });

  it('should call getOtpErrorMessage when the field is otp', () => {
    const formErrors = {
      otp: { error: 'expired' as InputErrorTypes },
    };
    const mockOtpMessage = 'Your code has expired.';
    (getOtpErrorMessage as jest.Mock).mockReturnValue(mockOtpMessage);

    const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

    expect(getOtpErrorMessage).toHaveBeenCalledWith('expired', mockEmail);
    expect(result?.otp).toEqual([mockOtpMessage]);
  });

  it('should use the field key as a fallback if the label is not found in inputs', () => {
    const formErrors = {
      unknownField: { error: 'required' as InputErrorTypes },
    };

    const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

    expect(result?.unknownField).toEqual(['Please enter a valid unknownfield']);
  });

  it('orders errors to match fieldLabels definition order', () => {
    const formErrors = {
      medical_screening_company: { error: 'required' as InputErrorTypes },
      offers_telephone_quote: { error: 'required' as InputErrorTypes },
      will_cover_specialist_equipment: { error: 'required' as InputErrorTypes },
      how_far_in_advance_trip_cover: { error: 'required' as InputErrorTypes },
    };
    const fieldLabels = {
      offers_telephone_quote: 'Do you offer a telephone quote service?',
      will_cover_specialist_equipment:
        'Do you offer cover for specialist medical equipment?',
      medical_screening_company: 'Your medical screening provider',
      how_far_in_advance_trip_cover: 'How far in advance do you provide cover?',
    };

    const result = generateSummaryErrors(
      formErrors,
      mockInputs,
      '',
      true,
      undefined,
      fieldLabels,
    );

    expect(Object.keys(result!)).toEqual([
      'offers_telephone_quote',
      'will_cover_specialist_equipment',
      'medical_screening_company',
      'how_far_in_advance_trip_cover',
    ]);
  });

  it('orders errors to match register input order when fieldLabels are not provided', () => {
    const formErrors = {
      mail: { error: 'invalid' as InputErrorTypes },
      givenName: { error: 'invalid' as InputErrorTypes },
      surname: { error: 'invalid' as InputErrorTypes },
    };

    const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

    expect(Object.keys(result!)).toEqual(['givenName', 'surname', 'mail']);
  });

  describe('hideErrorWhen logic', () => {
    test.each`
      relatedFieldHasError | relatedFieldIsInvalid | expectedMessage
      ${true}              | ${true}               | ${['']}
      ${false}             | ${true}               | ${['Please enter a valid customdependentfield']}
      ${true}              | ${false}              | ${['Please enter a valid customdependentfield']}
      ${false}             | ${false}              | ${['Please enter a valid customdependentfield']}
    `(
      'returns $expectedMessage when related field error presence is $relatedFieldHasError and relatedFieldIsInvalid rule is $relatedFieldIsInvalid',
      ({ relatedFieldHasError, relatedFieldIsInvalid, expectedMessage }) => {
        const formErrors: FormErrorsState = {
          ...(relatedFieldHasError && {
            parentField: { error: 'invalid' as InputErrorTypes },
          }),
          customDependentField: {
            error: 'required' as InputErrorTypes,
            hideErrorWhen: {
              relatedFieldIsInvalid,
              relatedFieldKey: 'parentField',
            },
          },
        };

        const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

        expect(result?.customDependentField).toEqual(expectedMessage);
      },
    );
  });
});
