/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { Confirmation } from '../../../components';
import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { PageProps } from '../../../lib/types';
import {
  getCurrentStep,
  getSessionId,
  preparePayload,
} from '../../../lib/utils';
import { routeConfig } from '../../../routes/routeConfig';
import { getStoreEntry, getStoreFlow } from '../../../store';

const Page: NextPage<PageProps> = ({ step, flow, entry, referenceNumber }) => {
  return (
    <ContactFormsLayout step={step} heading={`layout.${flow}.title`}>
      <Confirmation entry={entry} referenceNumber={referenceNumber} />
    </ContactFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Run any guards for the current step
    await runGuards(context, routeConfig);

    // Get the collected data from the store
    const key = getSessionId(context);
    const { entry, store } = await getStoreEntry(key);
    const flow = await getStoreFlow(context);
    const code = process.env.API_CODE;
    const url = process.env.API_URL;
    if (!code || !url) {
      throw new Error('API code or URL is not set in environment variables');
    }

    // Prepare the payload
    const payload = preparePayload(entry.data);
    console.info('Payload for debugging:', payload); // DEBUG

    if (payload && key) {
      // Remove entry from the store and clear the cookie
      await store.delete(key);
      context.res.setHeader(
        'Set-Cookie',
        'fsid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
      );
    }

    const response = await fetch(`${url}?code=${code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Submission failed');
    }

    const responseData = await response.json();
    console.info('Submission successful', responseData);

    // Return props for the page
    return {
      props: {
        step: getCurrentStep(context),
        flow,
        referenceNumber: responseData.message,
        entry,
      },
    };
  } catch (error) {
    console.warn('Error in getServerSideProps confirmation:', error); // DEBUG
    return {
      notFound: true, // Catch all errors and redirect to 404 page (_error.tsx)
    };
  }
};

export default Page;
