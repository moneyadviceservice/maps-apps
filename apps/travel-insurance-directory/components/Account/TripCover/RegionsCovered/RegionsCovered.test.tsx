import {
  expectAccountFormApiSubmit,
  mockAccountFormFetchSuccess,
  setupAccountFormComponentTest,
} from 'lib/account/testing/accountFormComponentTestSetup';
import {
  testAgeLimitsPagePath,
  TRIP_COVER_TEST_COVER_AREA,
  TRIP_COVER_TEST_FIRM_ID,
} from 'lib/account/testing/tripCoverAccountTestHelpers';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RegionsCovered } from './RegionsCovered';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('hooks/useErrorSummary', () => ({
  useErrorSummary: jest.fn(),
}));

globalThis.fetch = jest.fn();

describe('RegionsCovered Component', () => {
  const { mockPush } = setupAccountFormComponentTest();

  it('renders the form with all region options', () => {
    render(<RegionsCovered firmId="firm-123" initialSelectedAreas={[]} />);

    expect(
      screen.getByRole('heading', {
        name: 'Which regions do you offer cover for?',
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Europe')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Worldwide excluding USA'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Worldwide')).toBeInTheDocument();
    expect(screen.getByTestId('regions-covered')).toHaveAttribute(
      'action',
      '/api/account/trip-cover/regions',
    );
  });

  it('pre-selects regions from initialSelectedAreas', () => {
    render(
      <RegionsCovered
        firmId="firm-123"
        initialSelectedAreas={['uk_and_europe']}
      />,
    );

    expect(screen.getByLabelText('Europe')).toBeChecked();
  });

  it('submits with isChangeAnswer when editing from summary', async () => {
    const user = userEvent.setup();
    mockAccountFormFetchSuccess('/account/trip-cover/confirm/firm-123');

    render(
      <RegionsCovered
        firmId="firm-123"
        initialSelectedAreas={['uk_and_europe']}
        isChangeAnswer
      />,
    );

    await user.click(screen.getByLabelText('Europe'));
    fireEvent.submit(screen.getByTestId('regions-covered'));

    await waitFor(() => {
      const [url, requestInit] = (globalThis.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(requestInit.body as string);

      expect(url).toBe('/api/account/trip-cover/regions?isChangeAnswer=true');
      expect(body.isChangeAnswer).toBe('true');
      expect(mockPush).toHaveBeenCalledWith(
        '/account/trip-cover/confirm/firm-123',
      );
    });
  });

  it('submits to the regions API with firmId and selected cover areas', async () => {
    const user = userEvent.setup();
    const nextPath = testAgeLimitsPagePath(
      TRIP_COVER_TEST_COVER_AREA,
      'single_trip',
    );
    mockAccountFormFetchSuccess(nextPath);

    render(
      <RegionsCovered
        firmId={TRIP_COVER_TEST_FIRM_ID}
        initialSelectedAreas={[]}
      />,
    );

    await user.click(screen.getByLabelText('Europe'));
    fireEvent.submit(screen.getByTestId('regions-covered'));

    await expectAccountFormApiSubmit({
      apiUrl: '/api/account/trip-cover/regions',
      expectedBody: {
        firmId: TRIP_COVER_TEST_FIRM_ID,
        cover_area: TRIP_COVER_TEST_COVER_AREA,
      },
      nextPath,
      mockPush,
    });
  });
});
