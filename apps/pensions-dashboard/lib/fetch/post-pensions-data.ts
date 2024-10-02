export const postPensionsData = async (
  userSessionId: string,
  authorizationCode: string,
  codeVerifier: string,
  redirectUrl: string,
) => {
  try {
    if (!process.env.MHPD_ISS) {
      throw new Error('ISS environment variable is not set');
    }
    const response = await fetch(
      `${process.env.MHPD_PENSIONS_DATA_URL}/pensions-data`,
      {
        method: 'POST',
        headers: {
          userSessionId: userSessionId,
          iss: process.env.MHPD_ISS,
        },
        body: JSON.stringify({
          authorisationCode: authorizationCode,
          redirectUrl: redirectUrl,
          codeVerifier: codeVerifier,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response;
  } catch (error) {
    console.error('failed to get response from POST: ', error);
    throw error;
  }
};
