import React from 'react';

import { buildPageAnalyticsData } from 'lib/analytics/pageAnalytics';
import { render, screen } from '@testing-library/react';

import { AnalyticsWrapper } from './AnalyticsWrapper';

const mockAnalytics = jest.fn(({ children }: { children: React.ReactNode }) => (
  <div data-testid="analytics-mock">{children}</div>
));

jest.mock('@maps-react/core/components/Analytics', () => ({
  Analytics: (props: { children: React.ReactNode }) => mockAnalytics(props),
}));

describe('AnalyticsWrapper', () => {
  beforeEach(() => {
    mockAnalytics.mockClear();
  });

  it('renders children', () => {
    render(
      <AnalyticsWrapper variant="viewFirms">
        <span>inner</span>
      </AnalyticsWrapper>,
    );

    expect(screen.getByText('inner')).toBeInTheDocument();
  });

  it('passes analyticsData and page-load-only trackDefaults to Analytics', () => {
    render(<AnalyticsWrapper variant="firmListings">{null}</AnalyticsWrapper>);

    expect(mockAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsData: buildPageAnalyticsData('firmListings'),
        currentStep: 0,
        formData: {},
        lastStep: 2,
        errors: [],
        trackDefaults: {
          toolCompletion: true,
          toolStartRestart: true,
          errorMessage: false,
          pageLoad: true,
          emptyToolCompletion: true,
        },
      }),
    );
  });

  it('uses currentStep in analytics when provided', () => {
    render(
      <AnalyticsWrapper variant="firmListings" currentStep={1}>
        {null}
      </AnalyticsWrapper>,
    );

    expect(mockAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({ currentStep: 1 }),
    );
  });
});
