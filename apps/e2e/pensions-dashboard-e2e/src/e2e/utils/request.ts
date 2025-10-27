import { APIRequestContext, APIResponse, Page } from '@playwright/test';

import { ENV } from '../data/environmentVariables';

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
