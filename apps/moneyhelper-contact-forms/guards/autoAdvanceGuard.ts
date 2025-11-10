import { GetServerSidePropsContext } from 'next';

import { AUTO_ADVANCE_STEP_MAP } from '../lib/constants';
import { Entry, EntryData } from '../lib/types';
import { getFlowSteps } from '../lib/utils';
import { ensureSessionAndStore } from '../lib/utils/ensureSessionAndStore';
import { getStoreEntry } from '../store';

/**
 * This guard automatically enters a user into a flow based on the flow name provided in the query parameter `aa`. Bypassing the flow selection phase of the app.
 * If the flow name exists in the AUTO_ADVANCE_STEP_MAP, it ensures a session, initializes the step index and redirects to the mapped step.
 * If the flow name is not valid, it does nothing.
 * Example usage: If the guard is added to the enquiry-type step in routeConfig AND the AUTO_ADVANCE_STEP_MAP containing a flow of 'mock-flow' and a step to advance to 'mock-step'. Hitting `en/enquiry-type?aa=mock-flow` will automatically redirect to `en/mock-step` and update the store entry to reflect this.
 * @param context
 * @returns
 */
export async function autoAdvanceGuard(context: GetServerSidePropsContext) {
  const { query, res, req } = context;
  const autoAdvanceFlow = Array.isArray(query.aa) ? query.aa[0] : query.aa;

  // Only proceed if a mapped auto-advance flow is present
  if (!autoAdvanceFlow || !AUTO_ADVANCE_STEP_MAP[autoAdvanceFlow]) {
    return;
  }

  const mappedStep = AUTO_ADVANCE_STEP_MAP[autoAdvanceFlow];
  const steps = getFlowSteps({
    data: { flow: autoAdvanceFlow } as EntryData,
  } as Entry);
  const targetStepIndex = steps.indexOf(mappedStep);
  const targetStep = mappedStep;
  const { language } = context.params || {};
  const langStr = Array.isArray(language) ? language[0] : language ?? 'en';
  const { key, responseHeaders } = await ensureSessionAndStore(
    req,
    autoAdvanceFlow,
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
