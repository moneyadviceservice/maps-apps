import z from 'zod';
import { ENV } from '@env';

import { ClassifiablePension } from '../pensionClassification/types';
import { ComposerGetResponse, PensionArrangement } from './types';

/**
 * Error thrown when HTTP requests fail.
 */
class HTTPError extends Error {}

/**
 * Error thrown when response content type is not as expected.
 */
class ResponseTypeError extends Error {}

/**
 * Error thrown when unexpected multiplicity in test data is detected.
 */
class TestScopeCreepError extends Error {}

/**
 * Fetches and transforms Composer scenario data.
 */
class ComposerDataFetcher {
  /**
   * @param environment - The target environment, either 'test' or 'dev'.
   */
  constructor(private readonly environment: 'test' | 'dev') {}

  /**
   * @deprecated Don't use this currently, we need to add an env var and set it up for the pipeline.
   *
   * Fetches a scenario from Composer and transforms it to classifiable pensions.
   *
   * @param scenarioName - The name of the scenario (alphanumeric, "_", "-", "+").
   * @returns A promise resolving to an array of `ClassifiablePension`.
   *
   * @throws {TypeError} When `scenarioName` contains invalid characters.
   * @throws {HTTPError} When the HTTP request fails.
   * @throws {ResponseTypeError} When the response content type is not JSON.
   * @throws {TestScopeCreepError} When multiple data points or pensions are returned.
   *
   * @example
   * ```ts
   * const pensions = await composerDataFetcher.dev.fetchScenario('scenario_123');
   * console.log(pensions);
   * ```
   */
  async fetchScenario(scenarioName: string): Promise<ClassifiablePension[]> {
    const composerUrl = ENV.MHPD_COMPOSER_API_URL;
    const validNamePattern = /^[A-Za-z0-9+_-]+$/;
    const validUrlPattern =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

    if (!validUrlPattern.test(composerUrl)) {
      throw new TypeError(
        `Expected URL for Composer was invalid, got: "${scenarioName}".`,
      );
    }

    if (!validNamePattern.test(scenarioName)) {
      throw new TypeError(
        `Expected input for fetchScenario was invalid. Only use alphanumeric characters and "_", "-", "+", got "${scenarioName}".`,
      );
    }

    const response = await fetch(
      `${ENV.MHPD_COMPOSER_API_URL}/composer/scenarios/${scenarioName}`,
    );

    if (!response.ok) {
      throw new HTTPError(
        `ComposerDataFetcher failed: ${response.status} ${response.statusText} with scenarioName "${scenarioName}"`,
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType !== 'application/json') {
      throw new ResponseTypeError(
        `Unexpected response type from Composer ${this.environment} with scenarioName "${scenarioName}". Received: "${contentType}".`,
      );
    }

    const data: ComposerGetResponse = await response.json();
    return this.transformResponse(data);
  }

  /**
   * Transforms a single `PensionArrangement` into a `ClassifiablePension`.
   *
   * @param pension - Pension arrangement to transform.
   * @returns Transformed `ClassifiablePension`.
   *
   * @private
   */
  private transformPension(pension: PensionArrangement): ClassifiablePension {
    const illustration = pension.benefitIllustrations?.[0];
    const eriComponent = illustration?.illustrationComponents?.find(
      (c) => c.illustrationType === 'ERI',
    );
    const apComponent = illustration?.illustrationComponents?.find(
      (c) => c.illustrationType === 'AP',
    );

    const unavailableApReason = z.enum([
      'ANO',
      'DBC',
      'DCC',
      'MEM',
      'NET',
      'NEW',
      'PPF',
      'TRN',
      'WU',
    ]);

    const unavailableERIReason = z.union([
      unavailableApReason,
      z.literal('DB'),
      z.literal('DCHA'),
      z.literal('DCHP'),
    ]);

    const illustrationDetails = (unavailableReason) =>
      z.object({
        componentExists: z.boolean(),
        unavailableReason: unavailableReason.optional(),
        annualAmount: z.number().optional(),
      });

    const schema = z.object({
      schemeName: z.string(),
      pensionType: z
        .enum(['DC', 'DB', 'AVC', 'CB', 'CBC', 'CDC', 'HYB', 'SP'])
        .optional(),
      matchType: z.enum(['DEFN', 'POSS', 'CONT', 'NEW', 'SYS']),
      pensionAdministrator: z.string(),
      eriDetails: illustrationDetails(unavailableERIReason),
      apDetails: illustrationDetails(unavailableApReason),
    });

    return schema.parse({
      schemeName: pension.schemeName,
      pensionType: pension.pensionType,
      pensionAdministrator: pension.pensionAdministrator.name,
      matchType: pension.matchType,
      eriDetails: {
        componentExists: !!eriComponent,
        unavailableReason: eriComponent?.unavailableReason,
        annualAmount: eriComponent?.payableDetails?.annualAmount,
      },
      apDetails: {
        componentExists: !!apComponent,
        unavailableReason: apComponent?.unavailableReason,
        annualAmount: apComponent?.payableDetails?.annualAmount,
      },
    });
  }

  /**
   * Transforms a `ComposerGetResponse` into an array of `ClassifiablePension`.
   *
   * @param data - The raw response data from Composer API.
   * @returns Array of transformed `ClassifiablePension`.
   *
   * @private
   */
  private transformResponse(data: ComposerGetResponse): ClassifiablePension[] {
    const dataPoints = data.data.dataPoints;
    if (dataPoints.length > 1) {
      throw new TestScopeCreepError(
        'Multiple data points detected - please review the approach.',
      );
    }

    const pensionPolicies = dataPoints[0].pensionsData.pensionPolicies;
    return pensionPolicies.map((policy) => {
      if (policy.pensionArrangements.length > 1) {
        throw new TestScopeCreepError(
          'Multiple pension policies detected; multiplicity not supported.',
        );
      }
      return this.transformPension(policy.pensionArrangements[0]);
    });
  }
}

/**
 * Exported Composer data fetchers for different environments.
 */
export const composerDataFetcher = {
  dev: new ComposerDataFetcher('dev'),
};
