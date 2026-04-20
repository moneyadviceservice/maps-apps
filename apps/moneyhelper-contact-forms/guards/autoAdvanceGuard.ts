import { GetServerSidePropsContext } from 'next';

import { ensureSessionAndStore } from '@maps-react/mhf/store';

import { flowConfig } from '../routes/flowConfig';

/**
 * Guard that automatically redirects users to a specific step in a flow based on the aa query parameter.
 * If the flow exists and has an autoAdvanceStep configured in flowConfig, this guard ensures a session,
 * sets the step, and redirects the user to the correct page. If not, it does nothing.
 * @param context
 * @returns
 */
export async function autoAdvanceGuard(context: GetServerSidePropsContext) {
  const { query, res, req } = context;
  const autoAdvanceFlowName = Array.isArray(query.aa) ? query.aa[0] : query.aa;

  // If no aa query param is provided, do nothing
  if (!autoAdvanceFlowName) {
    return;
  }

  // Check if the provided flow name is valid and has an autoAdvanceStep configured. If not, do nothing.
  const config = flowConfig.get(autoAdvanceFlowName);
  if (!config?.autoAdvanceStep) {
    return;
  }

  const mappedStep = config.autoAdvanceStep;
  const { language } = context.params || {};
  const lang = Array.isArray(language) ? language[0] : language ?? 'en';
  const { responseHeaders } = await ensureSessionAndStore(
    req,
    mappedStep,
    true,
    autoAdvanceFlowName,
    lang,
  );

  // Set the cookie header if it exists and redirect to the autoAdvanceStep
  const setCookie = responseHeaders.get('Set-Cookie');
  if (setCookie) res.setHeader('Set-Cookie', setCookie);
  res.writeHead(303, { Location: `/${lang}/${mappedStep}` });
  res.end();
}
