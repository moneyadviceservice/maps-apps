/*eslint-disable no-console */
import { EntryData } from '../../lib/types';
import { getFlowSteps } from '../../lib/utils';
import { ensureSessionAndStore } from '../../lib/utils/ensureSessionAndStore';

import { validateFormSubmission } from '../../form/';
import { StepName } from '../../lib/constants';
import { getStoreEntry, setStoreEntry } from '../../store';

/**
 * Handles form submissions by validating the data, updating the store entry, and redirecting to the appropriate step.
 * If validation fails, it stores the errors in the entry and redirects to the same step.
 * If validation succeeds, it increments the step index and redirects to the next step.
 * If an error occurs, it redirects to the error step.
 * @param req
 * @returns
 */
export default async function (req: Request) {
  console.info('Form handler invoked'); // DEBUG
  if (req.method === 'POST') {
    let key: string | null = null;
    try {
      // Get the session ID from the cookie and ensure session/store
      const result = await ensureSessionAndStore(req);
      key = result.key;
      const responseHeaders = result.responseHeaders;
      // Parse the form data
      const requestData = await req.formData();
      const dataObject = {} as EntryData;
      requestData.forEach((value, fieldName) => {
        dataObject[fieldName] =
          typeof value === 'object' ? JSON.stringify(value) : value.toString();
      });

      // Get the entry and update the data
      const entry = await getStoreEntry(key);
      entry.data = {
        ...entry.data,
        ...dataObject,
      };

      // Get the steps from the flow name
      const steps: string[] = getFlowSteps(entry);
      const errors = validateFormSubmission(entry, dataObject, steps);

      if (errors) {
        // Update the entry with errors and save it to the store, leave the step index unchanged so we redirect to the same step
        entry.errors = errors;
      } else {
        // No errors, increment the step index to reference the next step in the flow, clear errors and update the store
        entry.stepIndex++;
        entry.errors = {};
      }

      await setStoreEntry(key, entry);

      // Redirect to the current step if validation fails or to the next step if successful
      responseHeaders.append(
        'Location',
        `/${dataObject.lang || 'en'}/${steps[entry.stepIndex]}`,
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
