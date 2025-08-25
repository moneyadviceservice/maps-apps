import {
  REQUEST_ABANDONED,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
} from '../constants';
import { getCsrfToken } from './get-csrf-token';

type PostRedirectDetailsType = {
  userSessionId: string;
};

export const postRedirectDetails = async ({
  userSessionId,
}: PostRedirectDetailsType) => {
  try {
    if (!process.env.MHPD_ISS) {
      throw new Error(
        `${REQUEST_ABANDONED}: ISS environment variable is not set`,
      );
    }

    const xsrf = await getCsrfToken(process.env.MHPD_MAPS_CDA_SERVICE);

    const response = await fetch(
      `${process.env.MHPD_MAPS_CDA_SERVICE}/redirect-details`,
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
          redirectPurpose: 'FIND',
        }),
      },
    );

    if (!response.ok) {
      throw new Error(RESPONSE_NOT_OK);
    }

    return response.json();
  } catch (error) {
    console.error(`${REQUEST_FAILED}`, error);
    throw error;
  }
};
