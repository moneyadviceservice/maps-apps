import {
  expectAccountFormApiSubmit,
  mockAccountFormFetchSuccess,
  setupAccountFormComponentTest,
} from 'lib/account/testing/accountFormComponentTestSetup';
import { confirmPath } from 'lib/account/tripCover/steps';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ServiceDetails } from './ServiceDetails';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('hooks/useErrorSummary', () => ({
  useErrorSummary: jest.fn(),
}));

globalThis.fetch = jest.fn();

describe('ServiceDetails Component', () => {
  const { mockPush } = setupAccountFormComponentTest();
  const firmId = 'firm-123';

  it('renders the form with all required questions', () => {
    render(<ServiceDetails firmId={firmId} />);

    expect(
      screen.getByText('Do you offer a telephone quote service?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Do you offer cover for specialist medical equipment?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Your medical screening provider'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('How far in advance do you provide cover?'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('service-details')).toHaveAttribute(
      'action',
      '/api/account/trip-cover/service-details',
    );
  });

  it('prefills form values from Cosmos-shaped initial values', () => {
    render(
      <ServiceDetails
        firmId={firmId}
        initialFormValues={{
          offers_telephone_quote: 'yes',
          will_cover_specialist_equipment: 'no',
          medical_screening_company: 'verisk',
          how_far_in_advance_trip_cover: 'up-to-18-months',
        }}
      />,
    );

    const [telYes] = screen.getAllByLabelText('Yes');
    const [, specNo] = screen.getAllByLabelText('No');

    expect(telYes).toBeChecked();
    expect(specNo).toBeChecked();
    expect(
      screen.getByTestId('select-input-medical_screening_company'),
    ).toHaveValue('verisk');
    expect(
      screen.getByTestId('select-input-how_far_in_advance_trip_cover'),
    ).toHaveValue('up-to-18-months');
  });

  it('submits to the trip-cover service-details API and routes to confirm', async () => {
    const user = userEvent.setup();
    mockAccountFormFetchSuccess();

    render(<ServiceDetails firmId={firmId} />);

    const [telYes, specYes] = screen.getAllByLabelText('Yes');
    await user.click(telYes);
    await user.click(specYes);

    await user.selectOptions(
      screen.getByTestId('select-input-medical_screening_company'),
      'verisk',
    );
    await user.selectOptions(
      screen.getByTestId('select-input-how_far_in_advance_trip_cover'),
      'up-to-18-months',
    );

    fireEvent.submit(screen.getByTestId('service-details'));

    await expectAccountFormApiSubmit({
      apiUrl: '/api/account/trip-cover/service-details',
      expectedBody: {
        updatePath: 'service_details',
        firmId,
        offers_telephone_quote: 'yes',
        will_cover_specialist_equipment: 'yes',
        medical_screening_company: 'verisk',
        how_far_in_advance_trip_cover: 'up-to-18-months',
      },
      nextPath: confirmPath(firmId),
      mockPush,
    });
  });

  it('submits with isChangeAnswer when editing from summary', async () => {
    mockAccountFormFetchSuccess(confirmPath(firmId));

    render(<ServiceDetails firmId={firmId} isChangeAnswer />);
    fireEvent.submit(screen.getByTestId('service-details'));

    await expectAccountFormApiSubmit({
      apiUrl: '/api/account/trip-cover/service-details?isChangeAnswer=true',
      expectedBody: {
        updatePath: 'service_details',
        firmId,
        isChangeAnswer: 'true',
      },
      nextPath: confirmPath(firmId),
      mockPush,
    });
  });
});
