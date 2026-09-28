import {
  customerContactDetailsPage,
  emailField,
  telephoneNumberField,
  websiteAddressField,
} from 'data/pages/account/firm-details/customer-contact-details';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { render, screen } from '@testing-library/react';

import {
  mockCreateSubmitHandler,
  mockSubmitHandler,
  mockUseErrorSummary,
  mockUseRouter,
} from '../test-mocks';
import { CustomerContactDetails } from './CustomerContactDetails';

jest.mock('next/router', () => mockUseRouter);

jest.mock('hooks/useErrorSummary', () => mockUseErrorSummary);

jest.mock(
  'utils/helper/form/createSubmitHandler',
  () => mockCreateSubmitHandler,
);

const firmId = 'mock-firm-id-123';

describe('CustomerContactDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the supplied initial values', () => {
    const fields = [
      [websiteAddressField, 'https://example.com'],
      [telephoneNumberField, '02071234567'],
      [emailField, 'test@example.com'],
    ] as const;

    const firmData = {
      office: {
        contact: Object.fromEntries(
          fields.map(([field, value]) => [field.key, value]),
        ),
      },
    } as unknown as TravelInsuranceFirmDocument;

    render(<CustomerContactDetails initialValues={firmData} firmId={firmId} />);

    fields.forEach(([field, value]) => {
      expect(screen.getByTestId(field.key)).toHaveValue(value);
    });
  });

  it('creates the submit handler on render', () => {
    render(<CustomerContactDetails initialValues={null} firmId={firmId} />);

    expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
    expect(mockSubmitHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        apiUrl: expect.stringContaining(customerContactDetailsPage.submitApi),
        nextStep: expect.stringContaining(customerContactDetailsPage.nextStep),
        setIsPending: expect.any(Function),
        setFormSummaryErrors: expect.any(Function),
        router: expect.any(Object),
      }),
    );
  });
});
