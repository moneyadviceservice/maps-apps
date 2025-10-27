import { BabyMoneyTabIndex } from 'utils/tab';

import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { render } from '@testing-library/react';

import { BabyMoneyTimelineAnalytics } from './BabyMoneyTimeline';

jest.mock('@maps-react/core/components/Analytics', () => ({
  Analytics: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: jest.fn(),
}));

describe('BabyMoneyTimelineAnalytics Component', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: jest.fn((key) => key),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockProps = {
    currentTab: 1 as BabyMoneyTabIndex,
    formData: {},
    error: undefined,
  };

  it('fires toolCompletion event when currentTab is step 6', () => {
    const propsWithCompletion = {
      ...mockProps,
      currentStep: 6 as BabyMoneyTabIndex | 'landing',
    };

    render(
      <BabyMoneyTimelineAnalytics {...propsWithCompletion}>
        Test
      </BabyMoneyTimelineAnalytics>,
    );

    expect(Analytics).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsData: expect.anything(),
        currentStep: 6,
        formData: {},
        lastStep: 6,
        errors: [],
      }),
      expect.anything(),
    );
  });
});
