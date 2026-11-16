import {
  addressLineOneField,
  addressLineTwoField,
  countryField,
  postcodeField,
  townField,
} from 'data/pages/account/firm-details/principle-place-of-business';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { render, screen } from '@testing-library/react';

import {
  mockCreateSubmitHandler,
  mockSubmitHandler,
  mockUseErrorSummary,
  mockUseRouter,
} from '../test-mocks';
import { PrinciplePlaceOfBusiness } from './PrinciplePlaceOfBusiness';

jest.mock('next/router', () => mockUseRouter);

jest.mock('hooks/useErrorSummary', () => mockUseErrorSummary);

jest.mock(
  'utils/helper/form/createSubmitHandler',
  () => mockCreateSubmitHandler,
);

const testFirmId = 'firm-test-id-333';

describe('PrinciplePlaceOfBusiness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the supplied initial values', () => {
    const fields = [
      [addressLineOneField, '1 Test Street'],
      [addressLineTwoField, 'Suite 2'],
      [townField, 'London'],
      [countryField, 'United Kingdom'],
      [postcodeField, 'SW1A 1AA'],
    ] as const;

    const initialValues = Object.fromEntries(
      fields.map(([field, value]) => [field.key, value]),
    ) as unknown as TravelInsuranceFirmDocument;

    const firmData = {
      office: { address: initialValues },
    } as unknown as TravelInsuranceFirmDocument;

    render(
      <PrinciplePlaceOfBusiness initialValues={firmData} firmId={testFirmId} />,
    );

    fields.forEach(([field, value]) => {
      expect(screen.getByTestId(field.key)).toHaveValue(value);
    });
  });

  it('creates the submit handler on render', () => {
    render(
      <PrinciplePlaceOfBusiness initialValues={null} firmId={testFirmId} />,
    );

    expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
    expect(mockSubmitHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        apiUrl: expect.any(String),
        nextStep: expect.anything(),
        setIsPending: expect.any(Function),
        setFormSummaryErrors: expect.any(Function),
        router: expect.any(Object),
      }),
    );
  });
});
