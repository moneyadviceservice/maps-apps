import React from 'react';

import { useRouter } from 'next/router';

import { render } from '@testing-library/react';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';

import { Analytics } from './Analytics';

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Analytics Component', () => {
  let addEventMock: jest.Mock;

  beforeEach(() => {
    addEventMock = jest.fn();

    (useAnalytics as jest.Mock).mockReturnValue({
      addEvent: addEventMock,
    });

    (useRouter as jest.Mock).mockReturnValue({
      query: { restart: 'false' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockProps = {
    analyticsData: {
      page: { lang: 'en', pageName: 'Test Page', site: 'Test Site' },
      tool: { toolName: 'Test Tool', toolStep: 1, stepName: 'Step 1' },
    },
    currentStep: 1,
    formData: {},
    trackDefaults: {
      pageLoad: true,
      toolStartRestart: true,
      toolCompletion: true,
      errorMessage: true,
    },
  };

  it('fires pageLoad and tool start event when no form data exists', () => {
    render(<Analytics {...mockProps}>Test</Analytics>);

    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'pageLoadReact',
        page: {
          lang: 'en',
          pageName: 'Test Page',
          site: 'Test Site',
        },
        tool: {
          toolName: 'Test Tool',
          toolStep: 1,
          stepName: 'Step 1',
        },
      }),
    );

    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'toolStart',
        tool: {
          toolName: 'Test Tool',
          toolStep: 1,
          stepName: 'Step 1',
        },
      }),
    );
  });

  it('fires pageLoad event only when form data exists, i.e. tool has already started', () => {
    const formDataProps = {
      ...mockProps,
      currentStep: 1,
      lastStep: 3,
      formData: { field1: 'value1' },
    };

    render(<Analytics {...formDataProps}>Test</Analytics>);

    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'pageLoadReact',
        tool: {
          toolName: 'Test Tool',
          toolStep: 1,
          stepName: 'Step 1',
        },
      }),
    );

    expect(addEventMock).toHaveBeenCalledTimes(1);
  });

  it('fires toolRestart event when restart query is true', () => {
    (useRouter as jest.Mock).mockReturnValueOnce({
      query: { restart: 'true' },
    });

    render(<Analytics {...mockProps}>Test</Analytics>);

    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'toolRestart',
        tool: {
          toolName: 'Test Tool',
          toolStep: 1,
          stepName: 'Step 1',
        },
      }),
    );
  });

  it('fires toolCompletion event with correct AnalyticsData when tool completes', () => {
    const stepThreeAnalyticsData = {
      page: { lang: 'en', pageName: 'Test Page', site: 'Test Site' },
      tool: { toolName: 'Test Tool', toolStep: 3, stepName: 'Step 3' },
    };
    const completionProps = {
      ...mockProps,
      analyticsData: stepThreeAnalyticsData,
      currentStep: 3,
      lastStep: 3,
      formData: { field1: 'value1' },
    };

    render(<Analytics {...completionProps}>Test</Analytics>);

    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'toolCompletion',
        eventInfo: undefined,
        page: {
          lang: 'en',
          pageName: 'Test Page',
          site: 'Test Site',
        },
        tool: {
          toolName: 'Test Tool',
          toolStep: 3,
          stepName: 'Step 3',
        },
      }),
    );
  });

  it('fires errorMessage event with correct EventErrorDetails when errors are present', () => {
    const errorProps = {
      ...mockProps,
      errors: [
        {
          reactCompType: 'Component',
          reactCompName: 'TestComponent',
          errorMessage: 'Test error message',
        },
      ],
    };

    render(<Analytics {...errorProps}>Test</Analytics>);

    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'errorMessage',
        eventInfo: {
          toolName: 'Test Tool',
          toolStep: '1',
          stepName: 'Step 1',
          errorDetails: [
            {
              reactCompType: 'Component',
              reactCompName: 'TestComponent',
              errorMessage: 'Test error message',
            },
          ],
        },
      }),
    );
  });
  it('does not fire toolStart event when toolStartRestart is false', () => {
    const noStartProps = {
      ...mockProps,
      trackDefaults: {
        pageLoad: true,
        toolStartRestart: false,
        toolCompletion: true,
        errorMessage: true,
      },
    };

    render(<Analytics {...noStartProps}>Test</Analytics>);

    expect(addEventMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'toolStart',
      }),
    );
  });
  it('does not fire duplicate events on re-render', () => {
    const { rerender } = render(<Analytics {...mockProps}>Test</Analytics>);

    expect(addEventMock).toHaveBeenCalledTimes(2);

    rerender(<Analytics {...mockProps}>Test</Analytics>);

    expect(addEventMock).toHaveBeenCalledTimes(2);
  });
  it('does not fire errorMessage event when no errors exist', () => {
    const noErrorsProps = {
      ...mockProps,
      errors: [],
    };

    render(<Analytics {...noErrorsProps}>Test</Analytics>);

    expect(addEventMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'errorMessage',
      }),
    );
  });
  it('uses default trackDefaults values when trackDefaults is not provided', () => {
    const propsWithoutTrackDefaults = {
      ...mockProps,
      trackDefaults: undefined,
    };

    render(<Analytics {...propsWithoutTrackDefaults}>Test</Analytics>);

    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'pageLoadReact',
      }),
    );
  });
  it('renders children correctly', () => {
    const { getByText } = render(
      <Analytics {...mockProps}>Child Element</Analytics>,
    );

    const childElement = getByText('Child Element');
    expect(childElement).toBeDefined();
    expect(childElement).toBeTruthy();
  });
});
