import {
  NO_AGE_RESTRICTION_VALUE,
  NOT_OFFERED_VALUE,
} from 'data/pages/account/tripCover/tripCoverConfig';
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
import { emptyTripCoverAgeLimits } from 'lib/firms/firmDefaults';
import { fireEvent, render, screen } from '@testing-library/react';

import { TripCoverAgeLimits } from './TripCoverAgeLimits';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('hooks/useErrorSummary', () => ({
  useErrorSummary: jest.fn(),
}));

globalThis.fetch = jest.fn();

const defaultProps = {
  firmId: TRIP_COVER_TEST_FIRM_ID,
  coverArea: TRIP_COVER_TEST_COVER_AREA,
  tripType: 'single_trip' as const,
  initialAgeLimits: emptyTripCoverAgeLimits(),
};

describe('TripCoverAgeLimits Component', () => {
  const { mockPush } = setupAccountFormComponentTest();

  it('renders six age limit selects and intro copy', () => {
    render(<TripCoverAgeLimits {...defaultProps} />);

    expect(
      screen.getByText(
        'Enter the maximum age that can be covered for the destination, duration and type of trip.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Up to 30 days')).toBeInTheDocument();
    expect(screen.getByText('Up to 90 days')).toBeInTheDocument();
    expect(screen.getByText('Up to 90+ days')).toBeInTheDocument();
    expect(
      screen.getByTestId('select-input-up_to_30_days_land'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('select-input-over_90_days_cruise'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('select-input-up_to_30_days_land'),
    ).toHaveAttribute(
      'aria-label',
      'Up to 30 days - Maximum age for non-cruise trips',
    );
    expect(screen.getByTestId('up_to_30_days_land-title')).toHaveTextContent(
      'Up to 30 days - Maximum age for non-cruise trips',
    );
  });

  it('prefills selects from Cosmos-shaped age limits for the current step', () => {
    render(
      <TripCoverAgeLimits
        key="firm-123-uk_and_europe-single_trip"
        firmId="firm-123"
        coverArea="uk_and_europe"
        tripType="single_trip"
        initialAgeLimits={{
          up_to_30_days: { land: 1000, cruise: 1000 },
          up_to_90_days: { land: 1000, cruise: 1000 },
          over_90_days: { land: NOT_OFFERED_VALUE, cruise: 1000 },
        }}
      />,
    );

    expect(screen.getByTestId('select-input-up_to_30_days_land')).toHaveValue(
      String(NO_AGE_RESTRICTION_VALUE),
    );
    expect(screen.getByTestId('select-input-over_90_days_land')).toHaveValue(
      String(NOT_OFFERED_VALUE),
    );
  });

  it('remounts with distinct values when the self-serve step changes', () => {
    const { rerender } = render(
      <TripCoverAgeLimits
        key="firm-123-uk_and_europe-single_trip"
        firmId="firm-123"
        coverArea="uk_and_europe"
        tripType="single_trip"
        initialAgeLimits={{
          up_to_30_days: { land: 1000, cruise: 1000 },
          up_to_90_days: { land: 1000, cruise: 1000 },
          over_90_days: { land: NOT_OFFERED_VALUE, cruise: 1000 },
        }}
      />,
    );

    expect(screen.getByTestId('select-input-up_to_30_days_land')).toHaveValue(
      String(NO_AGE_RESTRICTION_VALUE),
    );

    rerender(
      <TripCoverAgeLimits
        key="firm-123-uk_and_europe-annual_multi_trip"
        firmId="firm-123"
        coverArea="uk_and_europe"
        tripType="annual_multi_trip"
        initialAgeLimits={{
          up_to_30_days: { land: 75, cruise: 70 },
          up_to_90_days: { land: NOT_OFFERED_VALUE, cruise: NOT_OFFERED_VALUE },
          over_90_days: { land: null, cruise: null },
        }}
      />,
    );

    expect(screen.getByTestId('select-input-up_to_30_days_land')).toHaveValue(
      '75',
    );
    expect(screen.getByTestId('select-input-up_to_90_days_land')).toHaveValue(
      String(NOT_OFFERED_VALUE),
    );
  });

  it('submits to the age limits API with firm and step context', async () => {
    const nextPath = testAgeLimitsPagePath(
      TRIP_COVER_TEST_COVER_AREA,
      'annual_multi_trip',
    );
    mockAccountFormFetchSuccess(nextPath);

    render(<TripCoverAgeLimits {...defaultProps} />);
    fireEvent.submit(screen.getByTestId('trip-cover-age-limits'));

    await expectAccountFormApiSubmit({
      apiUrl: '/api/account/trip-cover/age-limits',
      expectedBody: {
        firmId: TRIP_COVER_TEST_FIRM_ID,
        coverArea: TRIP_COVER_TEST_COVER_AREA,
        tripType: 'single_trip',
      },
      nextPath,
      mockPush,
    });
  });
});
