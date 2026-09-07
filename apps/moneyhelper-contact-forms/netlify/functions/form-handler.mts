import { validateFormSubmission } from '@maps-react/mhf/form';
import {
  ensureSessionAndStore,
  getStoreEntry,
  setStoreEntry,
} from '@maps-react/mhf/store';
import { EntryData } from '@maps-react/mhf/types';
import { asString, getCookieName } from '@maps-react/mhf/utils';
import { resolveNextSteps } from '@maps-react/mhf/utils/resolveNextSteps';

import { ResponseMessage, StepName } from '../../lib/constants';
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
export default async function formHandler(req: Request) {
  if (req.method === 'POST') {
    // eslint-disable-next-line prefer-const
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

      // 2. Keep stepIndex in sync with currentStep.
      // After the Next.js back-button behavior change (https://github.com/vercel/next.js/issues/94036),
      // we now sync in two places: here on form submit (browser back button)
      // and in validateStepGuard on page load/SSR (in-app < back navigation).

      const currentStep = asString(dataObject.currentStep);
      const currentStepIndex = entry.steps.indexOf(currentStep);

      if (currentStepIndex === -1) {
        throw new TypeError(
          `[form-handler] Invalid currentStep: ${currentStep}`,
        );
      }

      if (entry.stepIndex !== currentStepIndex) {
        entry.stepIndex = currentStepIndex;
        entry.errors = {};
      }

      const errors = validateFormSubmission(
        entry,
        dataObject,
        validationSchemas,
      );

      // 2. Extract stepName and flow from nextStep (e.g., "step|flow"). If flow is present, store it in entry.data.flow for downstream logic. Discard nextStep from the entry as it's a transient navigation field, not needed in the store.
      const { nextStep, ...formData } = dataObject;
      const [stepName, flow] = asString(nextStep).split('|');
      if (flow) entry.data.flow = flow;
      entry.data = { ...entry.data, ...formData };

      // 3. Check for errors
      if (errors) {
        // Store error - leave stepIndex unchanged so user is redirected to same step to fix errors
        entry.errors = errors;
      } else {
        if (!stepName) {
          throw new TypeError(
            '[form-handler] Missing nextStep token for successful submission',
          );
        }

        // Rebase future steps based on submitted next step token to enable dynamic branching
        resolveNextSteps(entry, stepName);
        entry.stepIndex++;

        entry.errors = {};
      }

      const redirectStep = entry.steps[entry.stepIndex];
      if (!redirectStep) {
        throw new TypeError(
          `[form-handler] Invalid redirect step at index ${entry.stepIndex}`,
        );
      }

      // 4. Update store entry
      await setStoreEntry(key, entry);

      // 5. Redirect to step based on stepIndex value
      responseHeaders.append(
        'Location',
        `/${dataObject.locale || 'en'}/${redirectStep}`,
      );
      return new Response(null, { status: 303, headers: responseHeaders });
    } catch (error: unknown) {
      console.error('Form handler error:', error);

      const responseHeaders = new Headers();
      responseHeaders.append(
        'Location',
        `/en/${StepName.ERROR}?status=${ResponseMessage.FORM_HANDLER_ERROR}`,
      );
      if (key) {
        responseHeaders.append(
          'Set-Cookie',
          `${getCookieName()}=${key}; Path=/; HttpOnly; Secure; SameSite=Lax; `,
        );
      }
      return new Response(null, { status: 303, headers: responseHeaders });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
