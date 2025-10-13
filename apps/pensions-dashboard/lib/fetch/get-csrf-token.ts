import { REQUEST_FAILED } from '../constants';

export type CsrfTokenResponse = {
  token: string;
  cookie: string;
};

export const getCsrfToken = async (
  serviceUrl?: string,
): Promise<CsrfTokenResponse> => {
  try {
    if (!serviceUrl) {
      throw new Error('Service URL is not defined');
    }

    const response = await fetch(`${serviceUrl}/csrf-token`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(
        `Response not OK: Failed to fetch CSRF token from ${serviceUrl}/csrf-token (status: ${response.status})`,
      );
    }

    const cookie = response.headers.get('set-cookie');
    if (!cookie) {
      throw new Error('Set-Cookie header not found in response');
    }

    const tokenMatch = /X-XSRF-TOKEN=([^;]+)/.exec(cookie);
    const token = tokenMatch?.[1]?.trim();
    if (!token) {
      throw new Error('CSRF token not found in Set-Cookie header');
    }

    return {
      token,
      cookie,
    };
  } catch (error) {
    console.error(
      `${REQUEST_FAILED}: Error fetching CSRF token from ${serviceUrl}:`,
      error,
    );
    throw error;
  }
};
