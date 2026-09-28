import { act, renderHook, waitFor } from '@testing-library/react';

import { mockGetBookingSlotsResponse } from './mocks';
import { AppointmentAvailabilityResponse } from './types';
import { useAppointmentAvailability } from './useAppointmentAvailability';
import { transformAppointmentData } from './utils';

jest.mock('./utils', () => ({
  transformAppointmentData: jest.fn(),
}));

const mockedTransformAppointmentData = jest.mocked(transformAppointmentData);

describe('useAppointmentAvailability', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial loading state', () => {
    mockedTransformAppointmentData.mockReturnValue({ days: [] });

    const { result } = renderHook(() => useAppointmentAvailability());

    expect(result.current).toEqual({
      data: null,
      isLoading: true,
      error: null,
    });
  });

  it('sets transformed data after the fetch delay', async () => {
    const transformedData: AppointmentAvailabilityResponse = {
      days: [
        {
          date: '2026-07-23',
          slots: [{ id: 'slot-1::08:10', time: '08:10' }],
        },
      ],
    };

    mockedTransformAppointmentData.mockReturnValue(transformedData);

    const { result } = renderHook(() => useAppointmentAvailability());

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(transformedData);
    expect(result.current.error).toBeNull();
    expect(mockedTransformAppointmentData).toHaveBeenCalledWith(
      mockGetBookingSlotsResponse,
    );
  });

  it('sets error when transform throws', async () => {
    const expectedError = new Error('transform failed');
    mockedTransformAppointmentData.mockImplementation(() => {
      throw expectedError;
    });

    const { result } = renderHook(() => useAppointmentAvailability());

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(expectedError);
  });

  it('sets fallback error when a non-Error is thrown', async () => {
    mockedTransformAppointmentData.mockImplementation(() => {
      throw 'boom';
    });

    const { result } = renderHook(() => useAppointmentAvailability());

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(
      new Error('Failed to fetch appointment availability'),
    );
  });

  it('does not update state after unmount on success path', async () => {
    mockedTransformAppointmentData.mockReturnValue({ days: [] });

    const { result, unmount } = renderHook(() => useAppointmentAvailability());

    unmount();

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current).toEqual({
      data: null,
      isLoading: true,
      error: null,
    });
  });

  it('does not set error after unmount on error path', async () => {
    mockedTransformAppointmentData.mockImplementation(() => {
      throw new Error('transform failed after unmount');
    });

    const { result, unmount } = renderHook(() => useAppointmentAvailability());

    unmount();

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current).toEqual({
      data: null,
      isLoading: true,
      error: null,
    });
  });
});
