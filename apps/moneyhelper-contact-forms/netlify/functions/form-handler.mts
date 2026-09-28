import { ResponseMessage } from '@maps-react/mhf/constants';
import {
  parseFormData,
  resolveNextSteps,
  syncCurrentStep,
  validateFormSubmission,
} from '@maps-react/mhf/form';
import {
  ensureSessionAndStore,
  getStoreEntry,
  setStoreEntry,
} from '@maps-react/mhf/store';
import { Entry } from '@maps-react/mhf/types';
import { getCookieName } from '@maps-react/mhf/utils';

import { StepName } from '../../lib/constants';
import { validationSchemas } from '../../routes/routeSchemas';

/**
 * Handles form submissions by validating user input, updating the store entry, and redirecting to the next step.
 *
 * - Derives the initial step from the submitted journeyType when no session/store entry exists yet
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
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  let key: string | null = null;

  try {
    const requestData = await req.formData();
    const { parsedData, nextStep, currentStep } = parseFormData(requestData);

    // Initialise a new session at the trusted server-side start step
    const session = await ensureSessionAndStore(req, StepName.ENQUIRY_TYPE);

    key = session.key;
    const { responseHeaders } = session;
    const entry = (await getStoreEntry(key)) as Entry;

    // Validate/synchronise the submitted page for an existing session
    syncCurrentStep(entry, currentStep);

    // Validate answers for the current stored ste
    const errors = validateFormSubmission(entry, parsedData, validationSchemas);

    entry.data = { ...entry.data, ...parsedData };

    // Check for validation errors
    if (errors) {
      // Store error - leave stepIndex unchanged so user is redirected to same step to fix errors
      entry.errors = errors;
    } else {
      // Determine the next route
      resolveNextSteps(entry, nextStep);
      entry.stepIndex++;
      entry.errors = {};
    }

    await setStoreEntry(key, entry);

    // Route to determined next step
    responseHeaders.append(
      'Location',
      `/${parsedData.locale || 'en'}/${entry.steps[entry.stepIndex]}`,
    );
    return new Response(null, { status: 303, headers: responseHeaders });
  } catch (error: unknown) {
    console.error('Form handler error:', error); // DEBUG

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

// return new Response('Method Not Allowed', { status: 405 });
// }
