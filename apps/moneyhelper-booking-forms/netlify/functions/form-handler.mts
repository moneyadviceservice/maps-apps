/*eslint-disable no-console */
import {
  ensureSessionAndStore,
  getStoreEntry,
  setStoreEntry,
} from '@maps-react/mhf/store';

import { validateFormSubmission } from '@maps-react/mhf/form';

import { FlowName, StepName } from '../../lib/constants';

import { EntryData } from '@maps-react/mhf/types';
import { getFlowSteps } from '@maps-react/mhf/utils';
import { routeFlow } from '../../routes/routeFlow';
import { validationSchemas } from '../../routes/routeSchemas';

/**
 * Handles form submissions by validating the data, updating the store entry, and redirecting to the appropriate step.
 *
 * When a user selects a flow at a junction (e.g., enquiry-type), the steps array is rebased:
 * - Preserves history up to the current step (git rebase: keep the prefix)
 * - Truncates future steps (git rebase: discard old commits)
 * - Appends the new flow segment (git rebase: apply new commits)
 *
 * This allows users to go back to junctions, pick a different flow, and follow that path instead.
 *
 * If validation fails, stores errors and redirects to the same step.
 * If an error occurs, redirects to the error step.
 * @param req
 * @returns
 */
export default async function formHandler(req: Request) {
  if (req.method === 'POST') {
    let key: string | null = null;
    try {
      const { key, responseHeaders } = await ensureSessionAndStore(
        req,
        FlowName.BASE,
        routeFlow,
      );

      const requestData = await req.formData();
      const dataObject = {} as EntryData;
      requestData.forEach((value, fieldName) => {
        dataObject[fieldName] =
          typeof value === 'object' ? JSON.stringify(value) : value.toString();
      });

      const entry = await getStoreEntry(key);
      const errors = validateFormSubmission(
        entry,
        dataObject,
        validationSchemas,
      );

      if (errors) {
        // Validation failed - update only errors, leave the stepIndex unchanged so user is redirected back to same step
        entry.errors = errors;
      } else {
        // 1. Store previous flow to detect changes
        const previousFlow = entry.data.flow;

        // 2. Update store entry data
        entry.data = { ...entry.data, ...dataObject };

        // 3. Determine if there is a flow change
        if (dataObject.flow && dataObject.flow !== previousFlow) {
          // get new flow steps based on updated flow
          const newSteps = getFlowSteps(dataObject.flow, routeFlow);

          // Git rebase pattern: keep prefix (completed steps) + apply new tail (chosen flow)
          // Removes all steps after current index and inserts the new flow segment
          entry.steps.splice(entry.stepIndex + 1, Infinity, ...newSteps);

          entry.stepIndex++;
        } else {
          // No flow change - simply increment step index
          entry.stepIndex++;
        }
        entry.errors = {};
      }

      await setStoreEntry(key, entry);

      // Redirect to the next step or same step if errors
      responseHeaders.append(
        'Location',
        `/${dataObject.lang || 'en'}/${entry.steps[entry.stepIndex]}`,
      );
      return new Response(null, { status: 303, headers: responseHeaders });
    } catch (error: any) {
      console.error('Form handler error:', error);

      const responseHeaders = new Headers();
      responseHeaders.append('Location', `/en/${StepName.ERROR}?status=104`);
      if (key) {
        responseHeaders.append(
          'Set-Cookie',
          `fsid=${key}; Path=/; HttpOnly; Secure; SameSite=Lax; `,
        );
      }
      return new Response(null, { status: 303, headers: responseHeaders });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
