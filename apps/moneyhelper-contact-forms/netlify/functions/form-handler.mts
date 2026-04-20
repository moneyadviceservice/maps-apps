/*eslint-disable no-console */
import {
  ensureSessionAndStore,
  getStoreEntry,
  setStoreEntry,
} from '@maps-react/mhf/store';

import { validateFormSubmission } from '@maps-react/mhf/form';

import { ResponseMessage, StepName } from '../../lib/constants';

import { EntryData } from '@maps-react/mhf/types';
import { resolveNextSteps } from '@maps-react/mhf/utils/resolveNextSteps';
import { validationSchemas } from '../../routes/routeSchemas';

/**
 * Handles form submissions by validating user input, updating the store entry, and redirecting to the next step.
 *
 * - Validates submitted form data against schema
 * - Updates the user's entry in the store (excluding transient navigation fields - nextStep)
 * - Determines the next step via resolveNextSteps()
 * - Redirects to the next step if valid, or stays on the current step if errors exist
 *
 * This function is server-side only and does not affect client rendering performance.
 *
 * @param req Incoming form submission request
 * @returns Redirect response to the next step or error page
 */
export default async function (req: Request) {
  if (req.method === 'POST') {
    let key: string | null = null;
    try {
      // 1. Ensure session and store entry exist
      const { key, responseHeaders } = await ensureSessionAndStore(
        req,
        StepName.ENQUIRY_TYPE,
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

      // 2. Extract stepName and flow from nextStep (e.g., "step|flow"). If flow is present, store it in entry.data.flow for downstream logic. Discard nextStep from the entry as it's a transient navigation field, not needed in the store.
      const { nextStep, ...formData } = dataObject;
      const [stepName, flow] = (nextStep ?? '').split('|');
      if (flow) entry.data.flow = flow;
      entry.data = { ...entry.data, ...formData };

      // 3. Check for errors
      if (errors) {
        // Store error - leave stepIndex unchanged so user is redirected to same step to fix errors
        entry.errors = errors;
      } else {
        // Rebase future steps based on submitted next step token to enable dynamic branching
        resolveNextSteps(entry, stepName);
        entry.stepIndex++;
        entry.errors = {};
      }

      // 4. Update store entry
      await setStoreEntry(key, entry);

      // 5. Redirect to step based on stepIndex value
      responseHeaders.append(
        'Location',
        `/${dataObject.lang || 'en'}/${entry.steps[entry.stepIndex]}`,
      );
      return new Response(null, { status: 303, headers: responseHeaders });
    } catch (error: any) {
      console.error('Form handler error:', error);

      const responseHeaders = new Headers();
      responseHeaders.append(
        'Location',
        `/en/${StepName.ERROR}?status=${ResponseMessage.FORM_HANDLER_ERROR}`,
      );
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
