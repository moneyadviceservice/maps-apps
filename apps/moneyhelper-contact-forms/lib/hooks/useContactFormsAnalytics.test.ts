import { renderHook } from '@testing-library/react';

import { mockEntry } from '@maps-react/mhf/mocks';

import { StepName } from '../constants';
import {
  useContactFormsAnalytics,
  useContactFormsAnalyticsProps,
} from './useContactFormsAnalytics';

// Mocks for dependencies
const mockAddEvent = jest.fn();
jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ addEvent: mockAddEvent }),
}));
jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  t: (key: string) => key,
  z: jest.fn(),
}));
jest.mock('@maps-react/utils/formatAnalyticsObject', () => ({
  formatAnalyticsObject: jest.fn((z, data) => ({
    ...data,
    tool: {},
    toolCy: {},
  })),
}));
jest.mock('@maps-react/mhf/analytics', () => ({
  buildErrorDetails: jest.fn(() => []),
  emitErrorEventIfAny: jest.fn(),
}));

const mockAnalyticsData: useContactFormsAnalyticsProps = {
  step: StepName.ENQUIRY_TYPE,
  entry: mockEntry,
  errors: {},
  url: '',
};

describe('useContactFormsAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('uses "error" as step if both step and url are missing', () => {
    renderHook(() =>
      useContactFormsAnalytics({
        ...mockAnalyticsData,
        step: '',
        url: '',
      }),
    );
    expect(mockAddEvent).toHaveBeenCalled();
    const callArg = mockAddEvent.mock.calls[0][0];
    expect(callArg.stepData.stepName).toBe('error');
  });

  it('falls back to getCurrentStep when step is missing', () => {
    renderHook(() =>
      useContactFormsAnalytics({
        ...mockAnalyticsData,
        step: '',
        url: '/en/mock-step-from-url',
      }),
    );
    expect(mockAddEvent).toHaveBeenCalled();
    const callArg = mockAddEvent.mock.calls[0][0];
    expect(callArg.stepData.stepName).toBe('mock-step-from-url');
  });

  it('calls addEvent when hook mounts', () => {
    renderHook(() => useContactFormsAnalytics(mockAnalyticsData));

    expect(mockAddEvent).toHaveBeenCalled();
  });

  it('handles undefined entry gracefully', () => {
    renderHook(() =>
      useContactFormsAnalytics({
        ...mockAnalyticsData,
        entry: undefined,
      }),
    );

    expect(mockAddEvent).toHaveBeenCalled();
  });

  it('handles referenceNumber on confirmation page', () => {
    renderHook(() =>
      useContactFormsAnalytics({
        ...mockAnalyticsData,
        step: StepName.CONFIRMATION,
        referenceNumber: 'ABC123',
      }),
    );

    expect(mockAddEvent).toHaveBeenCalled();
  });

  it('handles year on contact details page', () => {
    renderHook(() =>
      useContactFormsAnalytics({
        ...mockAnalyticsData,
        step: StepName.CONTACT_DETAILS,
        entry: {
          ...mockEntry,
          data: { ...mockEntry.data, year: '1990' },
        },
      }),
    );

    expect(mockAddEvent).toHaveBeenCalled();
  });

  it('handles error step with error details', () => {
    renderHook(() =>
      useContactFormsAnalytics({
        ...mockAnalyticsData,
        step: StepName.ERROR,
        errors: { name: ['required'] },
      }),
    );

    expect(mockAddEvent).toHaveBeenCalled();
  });
});
