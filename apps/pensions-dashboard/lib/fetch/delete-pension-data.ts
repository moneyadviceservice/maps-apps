import { REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';
import { getCsrfToken } from './get-csrf-token';

type DeletePensionDataType = {
  userSessionId: string;
};

export const deletePensionData = async ({
  userSessionId,
}: DeletePensionDataType): Promise<void> => {
  try {
    const xsrf = await getCsrfToken(process.env.MHPD_PENSION_DATA_SERVICE);
    const response = await fetch(
      `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions-data`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          userSessionId: userSessionId,
          mhpdCorrelationId: userSessionId,
          'X-XSRF-TOKEN': xsrf.token,
          Cookie: xsrf.cookie,
        },
        signal: new AbortController().signal,
      },
    );

    // 404 is acceptable (no data to delete)
    // 5XX should throw to prevent logout
    if (response.status >= 500) {
      const error = new Error(
        `${response.status}: ${RESPONSE_NOT_OK}`,
      ) as Error & { status: number };
      error.status = response.status;
      console.error(REQUEST_FAILED, error);
      throw error;
    }

    // Log other non-2xx responses but don't throw (allows logout to continue)
    if (!response.ok && response.status !== 404) {
      console.warn(
        `DELETE pension data returned ${response.status}, continuing with logout`,
      );
    }
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};
