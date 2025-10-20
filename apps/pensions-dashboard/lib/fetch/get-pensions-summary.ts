import {
  DATA_NOT_FOUND,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
  SESSION_EXPIRED,
} from '../constants';
import { GetPensionDataType } from '../types';
import { PensionsSummary } from '../types/api-responses';
import { isSessionExpired } from '../utils';

export const getPensionsSummary = async ({
  userSession: { userSessionId, sessionStart },
}: GetPensionDataType): Promise<PensionsSummary> => {
  const expired = await isSessionExpired(sessionStart);

  if (expired) {
    throw new Error(SESSION_EXPIRED);
  }

  try {
    const response = await fetch(
      `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions-summary`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          userSessionId: userSessionId,
          mhpdCorrelationId: userSessionId,
        },
        signal: new AbortController().signal,
      },
    );

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(RESPONSE_NOT_OK);
    }

    const data: PensionsSummary = await response.json();

    // If the data is not found, throw an error
    if (!data) {
      throw new Error(DATA_NOT_FOUND);
    }

    return data;
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};
