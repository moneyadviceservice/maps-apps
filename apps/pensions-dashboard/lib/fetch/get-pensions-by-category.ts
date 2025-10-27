import {
  DATA_NOT_FOUND,
  PensionsCategory,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
  SESSION_EXPIRED,
} from '../constants';
import { GetPensionDataType } from '../types';
import { PensionsByCategory } from '../types/api-responses';
import { isSessionExpired } from '../utils';

export const getPensionsByCategory = async (
  category: PensionsCategory,
  { userSession: { userSessionId, sessionStart } }: GetPensionDataType,
): Promise<PensionsByCategory> => {
  const expired = await isSessionExpired(sessionStart);

  if (expired) {
    throw new Error(SESSION_EXPIRED);
  }

  try {
    const response = await fetch(
      `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions/${category}`,
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

    const data: PensionsByCategory = await response.json();

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
