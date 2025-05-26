import {
  REQUEST_ABANDONED,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
} from '../constants';

type PostPensionsDataType = {
  userSessionId: string;
  authorizationCode: string;
  codeVerifier: string;
  redirectUrl: string;
  clientId: string;
  clientSecret: string;
};

export const postPensionsData = async ({
  userSessionId,
  authorizationCode,
  codeVerifier,
  redirectUrl,
  clientId,
  clientSecret,
}: PostPensionsDataType) => {
  try {
    if (!process.env.MHPD_ISS) {
      throw new Error(
        `${REQUEST_ABANDONED}: ISS environment variable is not set`,
      );
    }

    const response = await fetch(
      `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions-data`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          userSessionId: userSessionId,
          iss: process.env.MHPD_ISS,
          mhpdCorrelationId: userSessionId,
        },
        body: JSON.stringify({
          authorisationCode: authorizationCode,
          redirectUrl: redirectUrl,
          codeVerifier: codeVerifier,
          clientId: clientId,
          clientSecret: clientSecret,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(RESPONSE_NOT_OK);
    }

    return response;
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};
