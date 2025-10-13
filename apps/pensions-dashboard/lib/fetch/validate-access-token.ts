import { REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';

export const validateAccessToken = async (token: string): Promise<boolean> => {
  try {
    if (!process.env.MHPD_BETA_ACCESS_SERVICE) {
      throw new Error(
        'MHPD_BETA_ACCESS_SERVICE environment variable is not defined',
      );
    }

    const response = await fetch(
      `${process.env.MHPD_BETA_ACCESS_SERVICE}/validate`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token },
      },
    );

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(RESPONSE_NOT_OK);
    }

    return response.ok;
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};
