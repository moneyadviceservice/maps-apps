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
import { buildFormPath, getCookieName } from '@maps-react/mhf/utils';
import { getLanguage } from '@maps-react/utils/language';

import {
  FORM_BASE_PATH,
  FormFieldName,
  ResponseMessage,
  StepName,
} from '../../form/constants';
import { validationSchemas } from '../../form/routes/routeSchemas';

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

  // Extract the locale from the form action query param so we can redirect the user to the correct localized route on sucess or error - check it is one of the supported locales
  const url = new URL(req.url);
  const locale = getLanguage(url.searchParams.get('locale') ?? undefined);

  let key: string | null = null;

  try {
    const requestData = await req.formData();
    const { parsedData, nextStep, currentStep } = parseFormData(requestData);
    parsedData.locale = locale;

    // Initialise a new session at the trusted server-side start step
    const session = await ensureSessionAndStore(req, StepName.DATA_AND_PRIVACY);

    // if the parsedData contains an answer to sex other than "other", clear the otherSex field
    // This is for No JS benefit as we clear it in the component for JS enabled
    if (
      parsedData[FormFieldName.YOUR_SEX] &&
      parsedData[FormFieldName.YOUR_SEX] !== 'other'
    ) {
      parsedData[FormFieldName.OTHER_SEX] = '';
    }

    key = session.key;
    const { responseHeaders } = session;
    const entry = (await getStoreEntry(key)) as Entry;

    // Validate/synchronise the submitted page for an existing session
    syncCurrentStep(entry, currentStep);

    // Validate answers for the current stored ste
    const errors = validateFormSubmission(entry, parsedData, validationSchemas);

    entry.data = { ...entry.data, ...parsedData };

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
      buildFormPath(locale, entry.steps[entry.stepIndex], FORM_BASE_PATH),
    );
    return new Response(null, { status: 303, headers: responseHeaders });
  } catch (error: unknown) {
    console.error('Form handler error:', error); // DEBUG

    const responseHeaders = new Headers();
    responseHeaders.append(
      'Location',
      `${buildFormPath(locale, StepName.ERROR, FORM_BASE_PATH)}?status=${
        ResponseMessage.FORM_HANDLER_ERROR
      }`,
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
