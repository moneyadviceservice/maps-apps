import { ENV } from '@env';
import { APIRequestContext, APIResponse, Page } from '@maps/playwright';

export class RequestHelper {
  private static readonly mcCloudPensionTypes = [
    'legacy',
    'alternative',
  ] as const;

  private static appendMcCloudTypeQueryParam(
    baseUrl: string,
    mcCloudPensionType?: string,
  ): string {
    if (!mcCloudPensionType) {
      return baseUrl;
    }

    if (
      !this.mcCloudPensionTypes.includes(
        mcCloudPensionType as 'legacy' | 'alternative',
      )
    ) {
      throw new Error(
        `Invalid mcCloud pension type "${mcCloudPensionType}". Expected "legacy" or "alternative".`,
      );
    }

    return `${baseUrl}?type=${mcCloudPensionType}`;
  }

  private static resolveMcCloudPensionType(
    arrangement?: Record<string, unknown>,
  ): 'legacy' | 'alternative' | undefined {
    if (arrangement?.hasMultipleIncomeOptions !== true) {
      return undefined;
    }

    const possibleTypeFields = [
      arrangement.type,
      arrangement.incomeType,
      arrangement.incomeOptionType,
      arrangement.mcCloudType,
      arrangement.mccloudType,
      arrangement.paymentType,
    ];

    for (const value of possibleTypeFields) {
      if (value === 'legacy' || value === 'alternative') {
        return value;
      }
    }

    const providedTypeValue = possibleTypeFields.find(
      (value) => value !== undefined && value !== null && value !== '',
    );

    // if there is no mcCloud flag in the response
    // we omit the query param and let the endpoint return its default response.
    if (providedTypeValue === undefined) {
      return undefined;
    }

    throw new Error(
      `Invalid arrangement data: hasMultipleIncomeOptions=true but type value "${String(
        providedTypeValue,
      )}" is not one of "legacy" or "alternative".`,
    );
  }

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
        console.info(
          `Scheme Name: ${schemeName}, External Asset ID: ${externalAssetId}`,
        );

        // Call getPensionSchemeDetail for each arrangement
        await this.getPensionSchemeDetail(
          page,
          request,
          externalAssetId,
          arrangement,
        );
      }
    }
  }

  static async getPensionTimeline(
    page: Page,
    request: APIRequestContext,
    hasMultipleIncomeOptions = false,
  ): Promise<APIResponse[]> {
    const pensionTimelineUrl = `${ENV.MHPD_API_URL}/pension-data-service/pensions-timeline`;
    const testUserSessionId = await this.getSessionIdFromCookie(page);

    if (hasMultipleIncomeOptions) {
      const timelineResponses = await Promise.all(
        this.mcCloudPensionTypes.map(async (type) => {
          const timelineUrl = this.appendMcCloudTypeQueryParam(
            pensionTimelineUrl,
            type,
          );
          const response = await request.get(timelineUrl, {
            headers: {
              userSessionId: testUserSessionId,
              mhpdCorrelationId: testUserSessionId,
            },
          });

          if (response.status() !== 200) {
            throw new Error(
              `GET request failed for get pension timeline with type=${type} and status ${response.status()}`,
            );
          }

          return response;
        }),
      );

      return timelineResponses;
    }

    const getResponse = await request.get(pensionTimelineUrl, {
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

    return [getResponse];
  }

  static async getPensionSchemeDetail(
    page: Page,
    request: APIRequestContext,
    externalAssetId: string,
    arrangement?: Record<string, unknown>,
  ): Promise<APIResponse> {
    const basePensionDataUrl = `${ENV.MHPD_API_URL}/pension-data-service/pension-detail/${externalAssetId}`;
    const mcCloudPensionType = this.resolveMcCloudPensionType(arrangement);
    const pensionDataUrl = this.appendMcCloudTypeQueryParam(
      basePensionDataUrl,
      mcCloudPensionType,
    );
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
