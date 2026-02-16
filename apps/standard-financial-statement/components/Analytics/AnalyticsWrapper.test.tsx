import React from 'react';

import { render } from '@testing-library/react';

import { AnalyticsWrapper } from './AnalyticsWrapper';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('AnalyticsWrapper', () => {
  it('renders children inside Analytics', () => {
    const { container } = render(
      <AnalyticsWrapper analyticsData={{ page: { pageName: 'Test Page' } }}>
        <div>Test Child</div>
      </AnalyticsWrapper>,
    );
    expect(container).toMatchSnapshot();
  });
});
