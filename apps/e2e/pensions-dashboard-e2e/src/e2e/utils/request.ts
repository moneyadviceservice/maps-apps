import { ENV } from '@env';
import { APIRequestContext, APIResponse, Page } from '@maps/playwright';

export class RequestHelper {
  private static async getSessionIdFromCookie(page: Page): Promise<string> {
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

  static async getPensionSummary(
    page: Page,
    request: APIRequestContext,
  ): Promise<APIResponse> {
    const pensionSummaryUrl = `${ENV.MHPD_API_URL}/pension-data-service/pensions-summary`;
    const testUserSessionId = await this.getSessionIdFromCookie(page);
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

  static async getPensionCategory(
    page: Page,
    request: APIRequestContext,
    pensionCategory: string,
  ): Promise<APIResponse> {
    const pensionDataUrl = `${ENV.MHPD_API_URL}/pension-data-service/pensions/${pensionCategory}`;
    const testUserSessionId = await this.getSessionIdFromCookie(page);
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

  static async processPensionArrangements(
    page: Page,
    request: APIRequestContext,
    pensionCategoryResponse: APIResponse,
  ): Promise<void> {
    // Parse the response to get arrangements
    const responseData = await pensionCategoryResponse.json();

    if (responseData.arrangements && Array.isArray(responseData.arrangements)) {
      // Iterate through each arrangement
      for (const arrangement of responseData.arrangements) {
        const { externalAssetId, schemeName } = arrangement;

        // Log the schemeName and externalAssetId
        console.info(`Scheme Name: ${schemeName}, External Asset ID: ${externalAssetId}`);

        // Call getPensionSchemeDetail for each arrangement
        await this.getPensionSchemeDetail(page, request, externalAssetId);
      }
    }
  }

  static async getPensionTimeline(
    page: Page,
    request: APIRequestContext,
  ): Promise<APIResponse> {
    const pensionDataUrl = `${ENV.MHPD_API_URL}/pension-data-service/pensions-timeline`;
    const testUserSessionId = await this.getSessionIdFromCookie(page);
    const getResponse = await request.get(pensionDataUrl, {
      headers: {
        userSessionId: testUserSessionId,
        mhpdCorrelationId: testUserSessionId,
      },
    });

    if (getResponse.status() !== 200) {
      throw new Error(
        `GET request failed for get pension timeline with status ${getResponse.status()}`,
      );
    }

    return getResponse;
  }

  static async getPensionSchemeDetail(
    page: Page,
    request: APIRequestContext,
    externalAssetId: string,
  ): Promise<APIResponse> {
    const pensionDataUrl = `${ENV.MHPD_API_URL}/pension-data-service/pension-detail/${externalAssetId}`;
    console.info(`Pension data URL: ${pensionDataUrl}`);
    const testUserSessionId = await this.getSessionIdFromCookie(page);
    const getResponse = await request.get(pensionDataUrl, {
      headers: {
        userSessionId: testUserSessionId,
        mhpdCorrelationId: testUserSessionId,
      },
    });

    if (getResponse.status() !== 200) {
      throw new Error(
        `GET request failed for get pension detail for a pension scheme with external asset ID ${externalAssetId} with status ${getResponse.status()}`,
      );
    }

    return getResponse;
  }
}
