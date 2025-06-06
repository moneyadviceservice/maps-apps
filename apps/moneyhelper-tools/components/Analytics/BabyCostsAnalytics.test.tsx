import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { render } from '@testing-library/react';
import { BabyCostTabIndex } from 'pages/[language]/baby-cost-calculator/[tab]';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Analytics } from '@maps-react/core/components/Analytics';
import { BabyCostsAnalytics } from './BabyCostsAnalytics';

type BabyCostsIndex = BabyCostTabIndex | 'save' | 'saved';

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: jest.fn(),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@maps-react/core/components/Analytics', () => ({
  Analytics: jest.fn(({ children }) => <>{children}</>),
}));

describe('BabyCostsAnalytics Component', () => {
  let addEventMock: jest.Mock;

  beforeEach(() => {
    addEventMock = jest.fn();

    (useAnalytics as jest.Mock).mockReturnValue({
      addEvent: addEventMock,
    });

    (useTranslation as jest.Mock).mockReturnValue({
      z: jest.fn((key) => key),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockProps = {
    currentTab: 1 as BabyCostsIndex,
    formData: {},
    resultsTotal: 0,
    error: undefined,
  };

  it('fires toolCompletion event when currentTab is 5 and baby-due is not "9"', () => {
    const propsWithCompletion = {
      ...mockProps,
      currentTab: 5 as BabyCostsIndex,
      formData: { 'baby-due': '7' },
    };

    render(
      <BabyCostsAnalytics {...propsWithCompletion}>Test</BabyCostsAnalytics>,
    );

    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'toolCompletion',
      }),
    );
  });

  it('fires toolCompletionNoInput event when baby-due is "9" and resultsTotal is 0', () => {
    const propsWithNoInput = {
      ...mockProps,
      currentTab: 5 as BabyCostsIndex,
      formData: { 'baby-due': '9' },
      resultsTotal: 0,
    };

    render(<BabyCostsAnalytics {...propsWithNoInput}>Test</BabyCostsAnalytics>);

    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'toolCompletionNoInput',
      }),
    );
  });

  it('fires errorMessage event when currentTab is "save" and error is present', () => {
    const propsWithError = {
      ...mockProps,
      currentTab: 'save' as BabyCostsIndex,
      error: 'Invalid email address',
    };

    render(<BabyCostsAnalytics {...propsWithError}>Test</BabyCostsAnalytics>);

    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'errorMessage',
        eventInfo: {
          toolName: 'Baby Costs Calculator',
          toolStep: '',
          stepName: '',
          errorDetails: [
            {
              reactCompType: 'TextInput',
              reactCompName: 'Your email address',
              errorMessage: 'Invalid email address',
            },
          ],
        },
      }),
    );
  });

  it('renders Analytics component with correct props', () => {
    const propsWithAnalytics = {
      ...mockProps,
      currentTab: 2 as BabyCostsIndex,
      formData: { 'baby-due': '7' },
    };

    render(
      <BabyCostsAnalytics {...propsWithAnalytics}>Test</BabyCostsAnalytics>,
    );

    expect(Analytics).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsData: expect.any(Object),
        currentStep: 2,
        formData: { 'baby-due': '7' },
        trackDefaults: {
          pageLoad: true,
          toolStartRestart: true,
          toolCompletion: false,
          errorMessage: false,
        },
      }),
      expect.anything(),
    );
  });
});
