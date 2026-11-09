import {
  DATA_NOT_FOUND,
  REQUEST_ABANDONED,
  REQUEST_FAILED,
  RESPONSE_NOT_ACCEPTED,
  RESPONSE_NOT_OK,
  SESSION_EXPIRED,
} from '../constants';

type CsrfTokenResponse = {
  token: string;
  cookie: string;
};

type ServiceGetRequestParams = {
  serviceUrl: string;
  endpoint: string;
  userSessionId: string;
  sessionStart?: string;
  isSessionExpired?: (sessionStart: string) => Promise<boolean>;
  includeIss?: boolean;
  additionalHeaders?: Record<string, string>;
};

type ServicePostRequestParams = {
  serviceUrl: string;
  endpoint: string;
  userSessionId: string;
  body: Record<string, unknown>;
  requiresIss?: boolean;
  expectedStatus?: 'ok' | 'created' | 'accepted' | number;
  returnResponse?: boolean;
  additionalHeaders?: Record<string, string>;
};

type ServiceDeleteRequestParams = {
  serviceUrl: string;
  endpoint: string;
  userSessionId: string;
};

/**
 * Retrieves CSRF token for a specific service URL.
 * Internal function used by service request helpers.
 *
 * @param {string} serviceUrl - The base service URL to get CSRF token from
 *
 * @returns {Promise<CsrfTokenResponse>} Promise that resolves to CSRF token and cookie
 *
 * @throws {Error} When service URL is not provided
 * @throws {Error} When the response is not ok
 * @throws {Error} When Set-Cookie header is not found
 * @throws {Error} When CSRF token is not found in Set-Cookie header
 */
const getCsrfTokenForService = async (
  serviceUrl: string,
): Promise<CsrfTokenResponse> => {
  try {
    const response = await fetch(`${serviceUrl}/csrf-token`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(
        `Response not OK: Failed to fetch CSRF token from ${serviceUrl} (status: ${response.status})`,
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

/**
 * Generic service GET request handler that expects and validates response data.
 *
 * @template T - The expected response data type
 * @param {Object} params - Request parameters
 * @param {string} params.serviceUrl - The base service URL (e.g., 'https://api.example.com/service')
 * @param {string} params.endpoint - The endpoint path (e.g., '/pensions-data', '/pension-detail/123')
 * @param {string} params.userSessionId - The user session identifier
 * @param {string} [params.sessionStart] - Session start time for expiration check
 * @param {function} [params.isSessionExpired] - Function to check session expiration
 * @param {boolean} [params.includeIss] - Whether to include the ISS header from MHPD_ISS env var
 * @param {Object} [params.additionalHeaders] - Additional headers to include in the request
 *
 * @returns {Promise<T>} Promise that resolves to the response data
 *
 * @throws {Error} When ISS environment variable is not set (if includeIss is true)
 * @throws {Error} When session has expired
 * @throws {Error} When the response is not ok
 * @throws {Error} When no data is found
 * @throws {Error} When the fetch request fails
 */
export const serviceGetRequest = async <T>({
  serviceUrl,
  endpoint,
  userSessionId,
  sessionStart,
  isSessionExpired,
  includeIss = false,
  additionalHeaders = {},
}: ServiceGetRequestParams): Promise<T> => {
  // Check ISS environment variable if required
  if (includeIss && !process.env.MHPD_ISS) {
    throw new Error(
      `${REQUEST_ABANDONED}: ISS environment variable is not set`,
    );
  }

  // Check session expiration if sessionStart and validator are provided
  if (sessionStart && isSessionExpired) {
    const expired = await isSessionExpired(sessionStart);
    if (expired) {
      throw new Error(SESSION_EXPIRED);
    }
  }

  // Build headers with optional ISS
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    userSessionId: userSessionId,
    mhpdCorrelationId: userSessionId,
    ...additionalHeaders,
  };

  if (includeIss && process.env.MHPD_ISS) {
    headers.iss = process.env.MHPD_ISS;
  }

  try {
    const response = await fetch(`${serviceUrl}${endpoint}`, {
      method: 'GET',
      headers,
      signal: new AbortController().signal,
    });

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(RESPONSE_NOT_OK);
    }

    const data: T = await response.json();

    // If data is not found, throw an error
    if (!data) {
      throw new Error(DATA_NOT_FOUND);
    }

    return data;
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};

/**
 * Makes a POST request to a service endpoint with standardised error handling, CSRF protection, and ISS authentication.
 *
 * @template T - The expected response type
 * @param {Object} params - Request parameters
 * @param {string} params.serviceUrl - The base service URL (e.g., 'https://api.example.com/service')
 * @param {string} params.endpoint - The endpoint path (e.g., '/pensions-data', '/pensions-data-retrieval')
 * @param {string} params.userSessionId - The user session identifier
 * @param {Object} params.body - The request body object to be JSON stringified
 * @param {boolean} [params.requiresIss=true] - Whether ISS header is required
 * @param {'ok' | 'created' | 'accepted' | number} [params.expectedStatus='ok'] - Expected response validation
 * @param {boolean} [params.returnResponse=false] - Whether to return the raw Response object instead of JSON
 * @param {Record<string, string>} [params.additionalHeaders] - Additional headers to include
 *
 * @returns {Promise<T | Response>} Promise that resolves to the parsed JSON response or raw Response
 *
 * @throws {Error} REQUEST_ABANDONED - When ISS environment variable is not set (if required)
 * @throws {Error} RESPONSE_NOT_OK - When response status doesn't match expected
 * @throws {Error} REQUEST_FAILED - When the fetch request fails
 */
export const servicePostRequest = async <T = unknown>(
  params: ServicePostRequestParams,
): Promise<T> => {
  const {
    serviceUrl,
    endpoint,
    userSessionId,
    body,
    requiresIss = true,
    expectedStatus = 'ok',
    returnResponse = false,
    additionalHeaders = {},
  } = params;
  try {
    // Check ISS requirement
    if (requiresIss && !process.env.MHPD_ISS) {
      throw new Error(
        `${REQUEST_ABANDONED}: ISS environment variable is not set`,
      );
    }

    // Get CSRF token for this service
    const xsrf = await getCsrfTokenForService(serviceUrl);

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      userSessionId,
      mhpdCorrelationId: userSessionId,
      'X-XSRF-TOKEN': xsrf.token,
      Cookie: xsrf.cookie,
      ...additionalHeaders,
    };

    // Add ISS header if required and available
    if (requiresIss && process.env.MHPD_ISS) {
      headers.iss = process.env.MHPD_ISS;
    }

    const response = await fetch(`${serviceUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    // Validate response status based on expectation
    let statusValid = false;
    switch (expectedStatus) {
      case 'ok':
        statusValid = response.ok;
        break;
      case 'created':
        statusValid = response.status === 201;
        break;
      case 'accepted':
        statusValid = response.status === 202;
        break;
      default:
        statusValid = response.status === expectedStatus;
        break;
    }

    if (!statusValid) {
      if (expectedStatus === 'accepted') {
        throw new Error(RESPONSE_NOT_ACCEPTED);
      } else {
        throw new Error(RESPONSE_NOT_OK);
      }
    }

    // Return raw response if requested, otherwise parse JSON
    if (returnResponse) {
      return response as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};

/**
 * Makes a DELETE request to a service endpoint with standardised error handling and CSRF protection.
 * Handles the specific DELETE semantics: 404 is OK (nothing to delete), 5XX throws errors, other 4XX get warnings.
 *
 * @param {Object} params - Request parameters
 * @param {string} params.serviceUrl - The base service URL (e.g., 'https://api.example.com/service')
 * @param {string} params.endpoint - The endpoint path (e.g., '/pensions-data')
 * @param {string} params.userSessionId - The user session identifier
 *
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 *
 * @throws {Error} REQUEST_FAILED - When the fetch request fails
 * @throws {Error} RESPONSE_NOT_OK - When server errors (5XX) occur
 */
export const serviceDeleteRequest = async ({
  serviceUrl,
  endpoint,
  userSessionId,
}: ServiceDeleteRequestParams): Promise<void> => {
  try {
    // Get CSRF token for this service
    const xsrf = await getCsrfTokenForService(serviceUrl);

    // Build headers - DELETE requests don't need ISS
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      userSessionId,
      mhpdCorrelationId: userSessionId,
      'X-XSRF-TOKEN': xsrf.token,
      Cookie: xsrf.cookie,
    };

    const response = await fetch(`${serviceUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
      signal: new AbortController().signal,
    });

    // Handle server errors (5XX) - these should throw to prevent logout
    if (response.status >= 500) {
      const error = new Error(
        `${response.status}: ${RESPONSE_NOT_OK}`,
      ) as Error & { status: number };
      error.status = response.status;
      console.error(REQUEST_FAILED, error);
      throw error;
    }

    // Handle 404 - acceptable (nothing to delete)
    if (response.status === 404) {
      return; // Successfully handled - nothing to delete
    }

    // Log other non-2xx responses but don't throw (allows logout to continue)
    if (!response.ok) {
      console.warn(
        `DELETE request returned ${response.status}, continuing operation`,
      );
    }
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};
