import { renderHook } from '@testing-library/react';

import { mockEntry, mockErrors, mockSteps } from '@maps-react/mhf/mocks';

import { StepName } from '../constants';
import {
  useBookingFormsAnalytics,
  useBookingFormsAnalyticsProps,
} from './useBookingFormsAnalytics';

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
  formatAnalyticsObject: jest.fn(() => ({ tool: {}, toolCy: {} })),
}));
jest.mock('@maps-react/mhf/analytics', () => ({
  buildErrorDetails: jest.fn(() => []),
  emitErrorEventIfAny: jest.fn(),
}));

const mockAnalyticsData: useBookingFormsAnalyticsProps = {
  step: mockSteps[0],
  entry: mockEntry,
  errors: {},
  url: '',
};

describe('useBookingFormsAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls addEvent when hook mounts', () => {
    renderHook(() => useBookingFormsAnalytics(mockAnalyticsData));

    expect(mockAddEvent).toHaveBeenCalled();
  });

  it('handles undefined entry gracefully', () => {
    renderHook(() =>
      useBookingFormsAnalytics({
        ...mockAnalyticsData,
        entry: undefined,
      }),
    );

    expect(mockAddEvent).toHaveBeenCalled();
  });

  it('handles error step with error details', () => {
    renderHook(() =>
      useBookingFormsAnalytics({
        ...mockAnalyticsData,
        step: StepName.ERROR,
        errors: mockErrors,
      }),
    );

    expect(mockAddEvent).toHaveBeenCalled();
  });
});
