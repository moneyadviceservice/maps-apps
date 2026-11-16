import type { ComponentProps } from 'react';

import { render } from '@testing-library/react';

import { Analytics } from '@maps-react/core/components/Analytics';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';

import { AnalyticsTrigger } from './AnalyticsTrigger';

jest.mock('@maps-react/hooks/useAnalytics');

jest.mock('@maps-react/core/components/Analytics', () => ({
  Analytics: jest.fn(({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )),
}));

describe('AnalyticsTrigger', () => {
  const mockAddEvent = jest.fn();
  const mockAnalyticsData = {
    tool: { toolStep: '1' },
    page: { name: 'test-page' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAnalytics as jest.Mock).mockReturnValue({
      addEvent: mockAddEvent,
    });
  });

  const defaultProps: ComponentProps<typeof AnalyticsTrigger> = {
    analyticsData: mockAnalyticsData as unknown as AnalyticsData,
    children: <span>Child Content</span>,
  };

  const getTriggerElement = (
    props: Partial<ComponentProps<typeof AnalyticsTrigger>> = {},
  ) => {
    return <AnalyticsTrigger {...defaultProps} {...props} />;
  };

  it('calls addEvent with "toolStart" when step is "1" and flow is "user"', () => {
    render(getTriggerElement({ currentStep: '1', currentFlow: 'user' }));

    expect(mockAddEvent).toHaveBeenCalledWith({
      ...mockAnalyticsData,
      event: 'toolStart',
    });
  });

  it('does not call addEvent if currentFlow is not "user"', () => {
    render(getTriggerElement({ currentStep: '1', currentFlow: 'firm' }));

    expect(mockAddEvent).not.toHaveBeenCalled();
  });

  it('does not call addEvent if currentStep is not "1"', () => {
    render(getTriggerElement({ currentStep: '2', currentFlow: 'user' }));

    expect(mockAddEvent).not.toHaveBeenCalled();
  });

  it('only triggers the toolStart event once (ref check)', () => {
    const triggerJsx = getTriggerElement({
      currentStep: '1',
      currentFlow: 'user',
    });

    const { rerender } = render(triggerJsx);

    rerender(triggerJsx);

    expect(mockAddEvent).toHaveBeenCalledTimes(1);
  });

  it('passes correct default props down to the Analytics component', () => {
    const emptyAnalyticsData = {} as AnalyticsData;

    render(getTriggerElement({ analyticsData: emptyAnalyticsData }));

    expect(Analytics).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsData: emptyAnalyticsData,
        currentStep: 0,
        formData: {},
        lastStep: 21,
        errors: [],
        trackDefaults: {
          pageLoad: true,
          toolStartRestart: false,
          toolCompletion: true,
          errorMessage: true,
          emptyToolCompletion: true,
        },
      }),
      undefined,
    );
  });

  it('passes provided custom props down to the Analytics component correctly', () => {
    const customTrackEvents = {
      pageLoad: false,
      toolStartRestart: true,
      toolCompletion: false,
      errorMessage: false,
      emptyToolCompletion: false,
    };
    const customErrors = [
      {
        reactCompType: 'Input',
        reactCompName: 'email',
        errorMessage: 'Required',
      },
    ];

    render(
      getTriggerElement({
        lastStep: '5',
        trackEvents: customTrackEvents,
        error: customErrors,
      }),
    );

    expect(Analytics).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsData: mockAnalyticsData,
        currentStep: 1,
        lastStep: 5,
        trackDefaults: customTrackEvents,
        errors: customErrors,
      }),
      undefined,
    );
  });
});
