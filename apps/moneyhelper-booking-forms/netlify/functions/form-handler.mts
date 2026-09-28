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
import { EntryData } from '@maps-react/mhf/types';
import { asString, getCookieName } from '@maps-react/mhf/utils';

import {
  ALLOWED_JOURNEY_TYPES,
  JOURNEY_TYPE_INITIAL_STEP_MAP,
  JourneyType,
  StepName,
} from '../../lib/constants';
import { BookingEntry } from '../../lib/types';
import { resolveNextEditStep } from '../../lib/utils';
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

    // 1. Parse form data: extract nextStep and process fields
    const { parsedData, nextStep, currentStep } = parseFormData(requestData);

    // 2. Ensure session and store entry exist
    const session = await ensureSessionAndStore(
      req,
      resolveInitialStep(parsedData),
    );
    key = session.key;
    const { responseHeaders } = session;

    const entry = (await getStoreEntry(key)) as BookingEntry;

    // 3. Keep stepIndex in sync with currentStep for server-side submissions
    syncCurrentStep(entry, currentStep);

    // 4. Validate form submission against schema for current step
    const errors = validateFormSubmission(entry, parsedData, validationSchemas);

    // 5. Update entry data with parsed form data
    entry.data = { ...entry.data, ...parsedData };

    // 6. Store errors, or advance to the next step and clear errors
    if (errors) {
      // Store error - leave stepIndex unchanged so user is redirected to same step to fix errors
      entry.errors = errors;
    } else {
      if (entry.editMode === true) {
        // Keep existing flow shape in edit mode and resolve only the next edit step.
        resolveNextEditStep(entry, nextStep);
      } else {
        // Standard navigation for non-edit mode - rebase future steps based on submitted nextStep token to enable dynamic branching
        resolveNextSteps(entry, nextStep);
        entry.stepIndex++;
      }

      entry.errors = {};
    }

    // 7. Update store entry
    await setStoreEntry(key, entry);

    // 8. Redirect to step based on stepIndex value
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
/**
 * Determines the initial step based on the journey type, defaulting to the base journey if the type is not recognized.
 * @param parsedData The parsed form submission data containing the journey type.
 * @returns The initial step name based on the journey type.
 */
function resolveInitialStep(parsedData: EntryData): StepName {
  const journeyType = asString(parsedData.journeyType);
  return JOURNEY_TYPE_INITIAL_STEP_MAP[
    ALLOWED_JOURNEY_TYPES.has(journeyType) ? journeyType : JourneyType.BASE
  ];
}
