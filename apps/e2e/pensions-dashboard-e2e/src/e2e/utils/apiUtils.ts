import {
  APIRequestContext,
  APIResponse,
  request as playwrightRequest,
} from '@maps/playwright';

import { CookieUtils } from './cookieUtils';

export interface AuthorizationCodeRequestParams {
  userSessionId: string;
  mhpdCorrelationId: string;
  clientId: string;
  clientSecret: string;
  authorisationCode: string;
  redirectUrl: string;
  codeVerifier: string;
  baseUrl: string;
  xsrfToken: string;
  testCookie?: string;
}

export class APIUtils {
  static async postAuthorizationCode(
    request: APIRequestContext,
    params: AuthorizationCodeRequestParams,
  ): Promise<APIResponse> {
    const requestUrl = `${params.baseUrl}/pension-data-service/pensions-data`;

    const requestBody = {
      clientId: params.clientId,
      clientSecret: params.clientSecret,
      authorisationCode: params.authorisationCode,
      redirectUrl: params.redirectUrl,
      codeVerifier: params.codeVerifier,
    };

    const requestHeaders = {
      userSessionId: params.userSessionId,
      mhpdCorrelationId: params.mhpdCorrelationId,
      iss: 'mhpdIss',
      'X-XSRF-TOKEN': params.xsrfToken,
      'Content-Type': 'application/json',
    };

    //the csrf update require post and delete to have csrf token
    try {
      const response = await request.post(requestUrl, {
        headers: requestHeaders,
        data: requestBody,
      });
      return response;
    } catch (error: unknown) {
      throw new Error(
        `Authorization code flow request failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * Get a XSRF token from the provided service, given a base URL and service name.
   * - POST requests requires a 'X-XSRF-TOKEN' header, provided by a /csrf-token endpoint
   * - GET requests does not need any XSRF tokens.
   */
  static async getXSRFToken(baseUrl: string, service: string) {
    const requestUrl = `${baseUrl}/${service}/csrf-token`;
    const request = await playwrightRequest.newContext();

    // Initial CSRF request
    const response = await request.get(requestUrl);
    if (response.status() !== 200) {
      throw new Error(
        `Failed to fetch CSRF token from "${requestUrl}". Status: ${response.status()} - ${response.statusText()}`,
      );
    }

    const setCookieHeader = response.headers()['set-cookie'];
    if (!setCookieHeader) {
      throw new Error(`Missing "set-cookie" header from "${requestUrl}".`);
    }

    const cookies = CookieUtils.parseCookies(setCookieHeader);
    const xsrfToken = cookies.find((c) => c.name === 'X-XSRF-TOKEN');
    const antiforgery = cookies.find((c) =>
      c.name.startsWith('.AspNetCore.Antiforgery'),
    );

    if (!xsrfToken || !antiforgery) {
      throw new Error(
        `Required CSRF cookies not found. Got: [${cookies
          .map((c) => c.name)
          .join(', ')}]`,
      );
    }

    return {
      fullCookie: `${antiforgery.name}=${antiforgery.value}; ${xsrfToken.name}=${xsrfToken.value}`,
      antiforgery,
      xsrfToken,
    };
  }
}
