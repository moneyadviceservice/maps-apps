import { useEffect, useState } from 'react';

import { mockGetBookingSlotsResponse } from './mocks';
import { AppointmentAvailabilityResponse } from './types';
import { transformAppointmentData } from './utils';

export type UseAppointmentAvailabilityProps = {
  data: AppointmentAvailabilityResponse | null;
  isLoading: boolean;
  error: Error | null;
};

async function fetchAvailability(
  _signal: AbortSignal,
): Promise<AppointmentAvailabilityResponse> {
  // TODO: Replace with real GetBookingSlots API call and response adapter.
  // Keep AbortSignal in the function signature for the future fetch implementation.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return transformAppointmentData(mockGetBookingSlotsResponse);
}

/**
 * Fetches appointment availability from the API.
 * Uses AbortController signal in the local fetch helper to stop work if the component unmounts before the request completes.
 * @returns {data, isLoading, error} - The appointment availability data, loading state, and any error encountered.
 *
 */
export function useAppointmentAvailability(): UseAppointmentAvailabilityProps {
  const [data, setData] = useState<AppointmentAvailabilityResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAvailability() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchAvailability(controller.signal);

        if (!controller.signal.aborted) {
          setData(response);
        }
      } catch (unknownError) {
        const resolvedError =
          unknownError instanceof Error
            ? unknownError
            : new Error('Failed to fetch appointment availability');

        if (!controller.signal.aborted) {
          setError(resolvedError);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    data,
    isLoading,
    error,
  };
}
