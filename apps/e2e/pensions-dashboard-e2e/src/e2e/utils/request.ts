import { ENV } from '@env';
import { APIRequestContext, APIResponse, Page } from '@maps/playwright';

async function getSessionIdFromCookie(page: Page): Promise<string> {
  const cookies = await page.context().cookies();
  const sessionIdCookie = cookies.find((c) => c.name === 'mhpdSessionConfig');
  if (!sessionIdCookie) {
    throw new Error('mhpdSessionConfig cookie not found');
  }

  const mhpdSessionConfig = JSON.parse(sessionIdCookie.value);
  const testUserSessionId = mhpdSessionConfig?.userSessionId;
  console.log('userSessionId:', testUserSessionId);

  return testUserSessionId;
}

export async function getPensionSummary(
  page: Page,
  request: APIRequestContext,
): Promise<APIResponse> {
  const pensionSummaryUrl = `${ENV.MHPD_API_URL}/pension-data-service/pensions-summary`;
  const testUserSessionId = await getSessionIdFromCookie(page);
  const getResponse = await request.get(pensionSummaryUrl, {
    headers: {
      userSessionId: testUserSessionId,
      mhpdCorrelationId: testUserSessionId,
    },
  });

  if (getResponse.status() !== 200) {
    throw new Error(
      `GET request failed for get pension summary with status ${getResponse.status()}`,
    );
  }

  return getResponse;
}

export async function getPensionCategory(
  page: Page,
  request: APIRequestContext,
  pensionCategory: string,
): Promise<APIResponse> {
  const pensionDataUrl = `${ENV.MHPD_API_URL}/pension-data-service/pensions/${pensionCategory}`;
  const testUserSessionId = await getSessionIdFromCookie(page);
  const getResponse = await request.get(pensionDataUrl, {
    headers: {
      userSessionId: testUserSessionId,
      mhpdCorrelationId: testUserSessionId,
    },
  });

  if (getResponse.status() !== 200) {
    throw new Error(
      `GET request failed for get pension category with status ${getResponse.status()}`,
    );
  }

  return getResponse;
}
