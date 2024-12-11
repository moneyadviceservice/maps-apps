import { REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';

type PostRedirectDetailsType = {
  userSessionId: string;
  mhpdCorrelationId?: string;
};

export const postRedirectDetails = async ({
  userSessionId,
  mhpdCorrelationId,
}: PostRedirectDetailsType) => {
  try {
    const response = await fetch(
      `${process.env.MHPD_REDIRECT_DETAILS_URL}/redirect-details`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(mhpdCorrelationId && { mhpdCorrelationId: mhpdCorrelationId }),
        },
        body: JSON.stringify({
          redirectPurpose: 'FIND',
          userSessionId: userSessionId,
          iss: process.env.MHPD_ISS,
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
