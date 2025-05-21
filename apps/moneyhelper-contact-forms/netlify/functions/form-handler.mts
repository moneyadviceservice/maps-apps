/*eslint-disable no-console */
import { getStore } from '@netlify/blobs';
import { getFlowSteps, loadEnv } from '../../lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { EntryData } from '../../lib/types';

import { getStoreEntry } from '../../store';
import { validateFormSubmission } from '../../form/';
import { FlowName } from '../../lib/constants';

export default async function (req: Request) {
  if (req.method === 'POST') {
    try {
      // Get the session ID from the cookie
      const cookieHeader = req.headers.get('cookie') ?? '';
      let key = /(?:^|;\s*)fsid=([^;]*)/.exec(cookieHeader)?.[1] ?? null;

      const { name } = loadEnv();
      const store = getStore({ name, consistency: 'strong' });

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
        const initialEntry = {
          data: {
            flow: FlowName.DEFAULT,
            lang: 'en',
          },
          stepIndex: 0,
          errors: [],
        };

        // Save the initial entry to the store
        await store.setJSON(key, initialEntry);
        console.info('Initialized new session StoreEntry:', initialEntry); // DEBUG
      }

      // Parse the form data
      const requestData = await req.formData();
      const dataObject = {} as EntryData;
      requestData.forEach((value, fieldName) => {
        dataObject[fieldName] =
          typeof value === 'object' ? JSON.stringify(value) : value.toString();
      });

      // Get the entry and update the data
      const { entry } = await getStoreEntry(key);
      entry.data = {
        ...entry.data,
        ...dataObject,
      };

      // Get the steps from the flow name
      const steps: string[] = getFlowSteps(entry);

      // Validate the form submission
      const errors = validateFormSubmission(entry, dataObject, steps);

      if (errors) {
        // Update the entry with errors and save it to the store, leave the step index unchanged so we redirect to the same step
        entry.errors = errors;
        await store.setJSON(key, entry);
      } else {
        // No errors, increment the step index to reference the next step in the flow, clear errors and update the store
        entry.stepIndex++;
        entry.errors = [];
        await store.setJSON(key, entry);
      }

      // Redirect to the current step if validation fails or to the next step if successful
      responseHeaders.append(
        'Location',
        `/${dataObject.lang || 'en'}/${steps[entry.stepIndex]}`,
      );
      return new Response(null, { status: 303, headers: responseHeaders });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: error.message ?? 'Error in form submission' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
