import { APIRequestContext, APIResponse, Page } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import { APIUtils } from './apiUtils';

interface AuthRequest {
  clientId: string;
  ticket: string;
  clientSecret?: string;
  authorisationCode?: string;
  redirectUrl?: string;
  codeVerifier?: string;
}

interface AuthResponse {
  predictedTotalDataRetrievalTime: number;
}

export async function getPensionArrangementFromBE(
  page: Page,
  request: APIRequestContext,
): Promise<APIResponse> {
  // Get user session ID from cookies
  const cookies = await page.context().cookies();
  const sessionIdCookie = cookies.find((c) => c.name === 'mhpdSessionConfig');
  if (!sessionIdCookie) {
    throw new Error('mhpdSessionConfig cookie not found');
  }

  const mhpdSessionConfig = JSON.parse(sessionIdCookie.value);
  const testUserSessionId = mhpdSessionConfig?.userSessionId;
  console.log('userSessionId:', testUserSessionId);

  if (!testUserSessionId) {
    throw new Error('userSessionId not found in mhpdSessionConfig');
  }

  // Get CSRF token from pension data service
  const service = 'pension-data-service';
  const xsrfCookies = await APIUtils.getXSRFToken(ENV.MHPD_API_URL, service);

  // Prepare request URL and body
  const requestBody: AuthRequest = {
    clientId: "",
    ticket: ENV.MHPD_API_TEST_TICKET
    //clientId: ENV.MHPD_CLIENT_ID --To do after merge,
  };

  // Make POST request to set up state
  const pensionsDataretrievalUrl = `${ENV.MHPD_API_URL}/pension-data-service/pensions-data-retrieval`;
  const postResponse = await request.post(pensionsDataretrievalUrl, {
    headers: {
      userSessionId: testUserSessionId,
      mhpdCorrelationId: testUserSessionId,
      iss: 'mhpdIss',
      'X-XSRF-TOKEN': xsrfCookies.xsrfToken.value,
      Cookie: xsrfCookies.fullCookie,
    },
    data: requestBody,
  });

  if (postResponse.status() !== 202) {
    throw new Error(`POST request failed with status ${postResponse.status()}`);
  }

  const postJson = (await postResponse.json()) as AuthResponse;
  if (!postJson.predictedTotalDataRetrievalTime) {
    throw new Error('predictedTotalDataRetrievalTime was not returned');
  }

  // Wait 5 seconds, as the backend needs some time to process the request.
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const pensionDataUrl = `${ENV.MHPD_API_URL}/pension-data-service/pensions-data`;
  const getResponse = await request.get(pensionDataUrl, {
    headers: {
      userSessionId: testUserSessionId,
      mhpdCorrelationId: testUserSessionId,
    },
  });

  if (getResponse.status() !== 200) {
    throw new Error(`GET request failed with status ${getResponse.status()}`);
  }

  return getResponse;
}
