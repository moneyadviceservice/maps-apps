export const postRedirectDetails = async (userSessionId: string) => {
  try {
    const response = await fetch(
      `${process.env.MHPD_REDIRECT_DETAILS_URL}/redirect-details`,
      {
        method: 'POST',
        body: JSON.stringify({
          redirectPurpose: 'FIND',
          userSessionId: userSessionId,
          iss: process.env.MHPD_ISS,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (error) {
    console.error('failed to get response from POST: ', error);
    throw error;
  }
};
