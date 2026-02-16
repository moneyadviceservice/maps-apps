import { GetServerSidePropsContext } from 'next';

import { ensureSessionAndStore, getStoreEntry } from '@maps-react/mhf/store';
import { getFlowSteps } from '@maps-react/mhf/utils';

import { routeFlow } from '../routes/routeFlow';

/**
 * This guard automatically enters a user into a flow based on the flow name provided in the query parameter `aa`. Bypassing the flow selection phase of the app.
 * If the flow has an autoAdvanceStep configured in routeFlow, it ensures a session, initializes the step index and redirects to that step.
 * If the flow name is not valid or has no autoAdvanceStep, it does nothing.
 * Example usage: If the guard is added to the enquiry-type step in routeConfig AND routeFlow contains a flow with autoAdvanceStep set. Hitting `en/enquiry-type?aa=mhpd` will automatically redirect to the configured step and update the store entry to reflect this.
 * @param context
 * @returns
 */
export async function autoAdvanceGuard(context: GetServerSidePropsContext) {
  const { query, res, req } = context;
  const autoAdvanceFlow = Array.isArray(query.aa) ? query.aa[0] : query.aa;

  // Only proceed if a valid auto-advance flow is present
  if (!autoAdvanceFlow) {
    return;
  }

  const flowConfig = routeFlow.get(autoAdvanceFlow);
  const mappedStep = flowConfig?.autoAdvanceStep;

  if (!mappedStep) {
    return;
  }
  const steps = getFlowSteps(autoAdvanceFlow, routeFlow);
  const targetStepIndex = steps.indexOf(mappedStep);
  const targetStep = mappedStep;
  const { language } = context.params || {};
  const langStr = Array.isArray(language) ? language[0] : language ?? 'en';
  const { key, responseHeaders } = await ensureSessionAndStore(
    req,
    autoAdvanceFlow,
    routeFlow,
    targetStepIndex,
    true,
    langStr,
  );

  // Set the cookie header if it exists
  // This is to ensure the session ID is set in the response headers
  const setCookie = responseHeaders.get('Set-Cookie');
  if (setCookie) res.setHeader('Set-Cookie', setCookie);

  const entry = await getStoreEntry(key);
  const lang = entry.data.lang;
  res.writeHead(303, { Location: `/${lang}/${targetStep}` });
  res.end();
}
