import { REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';

// Types
type AccessTokenResponse = {
  token: string;
};

// Functions
/**
 * Retrieves an access token for beta access using a link ID.
 *
 * @param {string} [linkId] - The link identifier for beta access
 *
 * @returns {Promise<string>} Promise that resolves to the access token
 *
 * @throws {Error} When secure beta access is not enabled
 * @throws {Error} When required configuration or linkId is missing
 * @throws {Error} When the response is not ok
 * @throws {Error} When the fetch request fails
 */
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
