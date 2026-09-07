import { GetServerSidePropsContext } from 'next';

import { ensureSessionAndStore } from '../store';
import { FlowConfig } from '../types';
import { getExistingParams, getLanguage } from '../utils';

/**
 * Factory function to create an auto-advance guard based on the provided flow configuration.
 * The generated guard checks for the presence of an "aa" query parameter, validates it against the flow configuration, and if valid, sets up the session and redirects the user to the configured auto-advance step.
 * @param flowConfig - A mapping of flow names to their respective configurations, which should include the autoAdvanceStep for each flow.
 * Example usage:
 * const flowConfig = new Map<string, { autoAdvanceStep: string }>([
 *   ['exampleFlow', { autoAdvanceStep: 'example-step' }],
 * ]);
 * const autoAdvanceGuard = createAutoAdvanceGuard(flowConfig);
 * @returns
 */
export function createAutoAdvanceGuard(flowConfig: FlowConfig) {
  return async function autoAdvanceGuard(context: GetServerSidePropsContext) {
    const { query, res, req, resolvedUrl } = context;
    const autoAdvanceFlowName = Array.isArray(query.aa)
      ? query.aa[0]
      : query.aa;

    // If no aa query param is provided, do nothing
    if (!autoAdvanceFlowName) {
      return;
    }

    // Check if the provided flow name is valid and has an autoAdvanceStep configured. If not, do nothing.
    const config = flowConfig.get(autoAdvanceFlowName);
    if (typeof config?.autoAdvanceStep !== 'string') {
      return;
    }

    const mappedStep = config.autoAdvanceStep;
    const { language } = context.params || {};
    const locale = getLanguage(language);
    const { responseHeaders } = await ensureSessionAndStore(
      req,
      mappedStep,
      true,
      autoAdvanceFlowName,
      locale,
    );

    // Set the cookie header if it exists and redirect to the autoAdvanceStep
    const setCookie = responseHeaders.get('Set-Cookie');
    if (setCookie) res.setHeader('Set-Cookie', setCookie);

    const queryString = getExistingParams(resolvedUrl, ['aa']);
    const location = `/${locale}/${mappedStep}${
      queryString ? `?${queryString}` : ''
    }`;
    res.writeHead(303, { Location: location });
    res.end();
  };
}
