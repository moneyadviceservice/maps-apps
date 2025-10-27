import { REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';

type AccessTokenResponse = {
  token: string;
};

export const getAccessToken = async (linkId?: string): Promise<string> => {
  try {
    if (process.env.MHPD_SECURE_BETA_ENABLED !== 'true') {
      throw new Error('Secure beta access is not enabled.');
    }

    if (!process.env.MHPD_BETA_ACCESS_SERVICE || !linkId) {
      throw new Error('Missing required configuration or linkId');
    }

    const response = await fetch(
      `${
        process.env.MHPD_BETA_ACCESS_SERVICE
      }/activate?linkId=${encodeURIComponent(linkId)}`,
    );

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(RESPONSE_NOT_OK);
    }

    const { token }: AccessTokenResponse = await response.json();
    return token;
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};
