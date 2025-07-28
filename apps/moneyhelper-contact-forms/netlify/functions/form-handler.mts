/*eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid';
import { EntryData } from '../../lib/types';
import { getFlowSteps } from '../../lib/utils';

import { validateFormSubmission } from '../../form/';
import { INITIAL_ENTRY, StepName } from '../../lib/constants';
import { getStoreEntry, setStoreEntry } from '../../store';

export default async function (req: Request) {
  console.info('Form handler invoked'); // DEBUG
  if (req.method === 'POST') {
    try {
      // Get the session ID from the cookie
      const cookieHeader = req.headers.get('cookie') ?? '';
      let key = /(?:^|;\s*)fsid=([^;]*)/.exec(cookieHeader)?.[1] ?? null;

      const responseHeaders = new Headers();

      if (!key) {
        // Store initialisation happens when the session ID is not present (no cookie), so this must be the first request and step in the flow

        // Generate a new session ID and set it in the cookie
        key = uuidv4();
        responseHeaders.append(
          'Set-Cookie',
          `fsid=${key}; Path=/; HttpOnly; Secure; SameSite=Lax;`,
        );

        // Create a new store instance and initialize the entry
        await setStoreEntry(key, INITIAL_ENTRY);
        console.info('Initialized new session StoreEntry:', INITIAL_ENTRY); // DEBUG
      }

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
        entry.errors = [];
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
      return new Response(null, { status: 303, headers: responseHeaders });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
