import { renderHook } from '@testing-library/react';

import { StepName } from '../constants';
import { Entry } from '../types';
import {
  useContactFormsAnalytics,
  useContactFormsAnalyticsProps,
} from './useContactFormsAnalytics';

// Mocks for dependencies
jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ addEvent: jest.fn(), addPage: jest.fn() }),
}));
jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  t: (key: string) => key,
  z: jest.fn(),
}));
jest.mock('@maps-react/utils/formatAnalyticsObject', () => ({
  formatAnalyticsObject: jest.fn(() => ({ tool: {}, toolCy: {} })),
}));
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  getFieldError: jest.fn(),
}));

const mockEntry: Entry = {
  data: {
    lang: 'en',
    flow: 'test-route-flow',
  },
  stepIndex: 0,
  errors: {},
};

const mockAnalyticsData: useContactFormsAnalyticsProps = {
  step: StepName.ENQUIRY_TYPE,
  entry: mockEntry,
  errors: {},
  url: '',
};

describe('useContactFormsAnalytics', () => {
  it('should call addEvent with analyticsData on mount', () => {
    renderHook(() => useContactFormsAnalytics(mockAnalyticsData));
  });

  it('should handle an empty entry', () => {
    renderHook(() =>
      useContactFormsAnalytics({
        ...mockAnalyticsData,
        entry: undefined,
      }),
    );
  });

  it('should handle referenceNumber for confirmation page', () => {
    renderHook(() =>
      useContactFormsAnalytics({
        ...mockAnalyticsData,
        step: StepName.CONFIRMATION,
        entry: {
          ...mockEntry,
          data: {
            ...mockEntry.data,
          },
        },
        referenceNumber: 'ABC123',
      }),
    );
  });

  it('should handle year on contact details page', () => {
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
  });

  it('should handle an error event if the StepName is ERROR', () => {
    renderHook(() =>
      useContactFormsAnalytics({
        ...mockAnalyticsData,
        step: StepName.ERROR,
        errors: { name: ['required'] },
      }),
    );
  });

  it('should handle missing error fields,', () => {
    renderHook(() =>
      useContactFormsAnalytics({
        ...mockAnalyticsData,
        step: '',
        errors: { '': [''] },
      }),
    );
  });
});
