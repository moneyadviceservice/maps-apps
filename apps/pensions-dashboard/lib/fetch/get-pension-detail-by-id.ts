import {
  DATA_NOT_FOUND,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
  SESSION_EXPIRED,
} from '../constants';
import { GetPensionDataType, PensionArrangement } from '../types';
import { isSessionExpired } from '../utils';

export const getPensionDetailById = async (
  id: string,
  { userSession: { userSessionId, sessionStart } }: GetPensionDataType,
): Promise<PensionArrangement> => {
  const expired = await isSessionExpired(sessionStart);

  if (expired) {
    throw new Error(SESSION_EXPIRED);
  }

  try {
    const response = await fetch(
      `${process.env.MHPD_PENSION_DATA_SERVICE}/pension-detail/${id}`,
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

    const data: PensionArrangement[] = await response.json();

    // If the data is not found, throw an error
    if (!data || data.length === 0) {
      throw new Error(DATA_NOT_FOUND);
    }

    return data[0];
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};
