import { REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';

type PostRedirectDetailsType = {
  userSessionId: string;
};

export const postRedirectDetails = async ({
  userSessionId,
}: PostRedirectDetailsType) => {
  try {
    const response = await fetch(
      `${process.env.MHPD_MAPS_CDA_SERVICE}/redirect-details`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          mhpdCorrelationId: userSessionId,
          userSessionId: userSessionId,
          iss: process.env.MHPD_ISS ?? '',
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
