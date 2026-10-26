import {
  expectAccountFormApiSubmit,
  mockAccountFormFetchSuccess,
  setupAccountFormComponentTest,
} from 'lib/account/testing/accountFormComponentTestSetup';
import { TRIP_COVER_TEST_FIRM_ID } from 'lib/account/testing/tripCoverAccountTestHelpers';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TripCoverConfirm } from './TripCoverConfirm';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('hooks/useErrorSummary', () => ({
  useErrorSummary: jest.fn(),
}));

globalThis.fetch = jest.fn();

describe('TripCoverConfirm Component', () => {
  const { mockPush } = setupAccountFormComponentTest();

  it('renders the confirm form with firmId and correct submit action', () => {
    render(<TripCoverConfirm firmId={TRIP_COVER_TEST_FIRM_ID} />);

    expect(screen.getByTestId('trip-cover-confirm')).toHaveAttribute(
      'action',
      '/api/account/trip-cover/confirm',
    );
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Confirm');

    const firmIdInput = screen.getByDisplayValue(TRIP_COVER_TEST_FIRM_ID);
    expect(firmIdInput).toHaveAttribute('type', 'hidden');
    expect(firmIdInput).toHaveAttribute('name', 'firmId');
  });

  it('submits firmId to the confirm API and navigates to account', async () => {
    const user = userEvent.setup();
    mockAccountFormFetchSuccess('/account');

    render(<TripCoverConfirm firmId={TRIP_COVER_TEST_FIRM_ID} />);

    await user.click(screen.getByTestId('submit-button'));
    fireEvent.submit(screen.getByTestId('trip-cover-confirm'));

    await expectAccountFormApiSubmit({
      apiUrl: '/api/account/trip-cover/confirm',
      expectedBody: {
        firmId: TRIP_COVER_TEST_FIRM_ID,
      },
      nextPath: '/account',
      mockPush,
    });
  });
});
