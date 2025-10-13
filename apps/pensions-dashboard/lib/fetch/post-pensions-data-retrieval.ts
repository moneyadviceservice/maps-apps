import {
  REQUEST_ABANDONED,
  REQUEST_FAILED,
  RESPONSE_NOT_ACCEPTED,
} from '../constants';
import { getCsrfToken } from './get-csrf-token';

type PostPensionsDataRetrievalType = {
  userSessionId: string;
  ticket: string;
};

export const postPensionsDataRetrieval = async ({
  userSessionId,
  ticket,
}: PostPensionsDataRetrievalType) => {
  try {
    if (!process.env.MHPD_ISS) {
      throw new Error(
        `${REQUEST_ABANDONED}: ISS environment variable is not set`,
      );
    }

    const xsrf = await getCsrfToken(process.env.MHPD_PENSION_DATA_SERVICE);

    const response = await fetch(
      `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions-data-retrieval`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          mhpdCorrelationId: userSessionId,
          userSessionId: userSessionId,
          iss: process.env.MHPD_ISS,
          'X-XSRF-TOKEN': xsrf.token,
          Cookie: xsrf.cookie,
        },
        body: JSON.stringify({
          ticket,
          clientId: process.env.MHPD_CLIENT_ID,
        }),
      },
    );

    if (response.status !== 202) {
      throw new Error(RESPONSE_NOT_ACCEPTED);
    }

    return response;
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};
