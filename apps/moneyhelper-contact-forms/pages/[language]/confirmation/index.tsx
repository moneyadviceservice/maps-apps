/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { Confirmation } from '../../../components';
import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { StepName } from '../../../lib/constants';
import { useContactFormsAnalytics } from '../../../lib/hooks';
import { PageProps } from '../../../lib/types';
import {
  getCurrentStep,
  getSessionId,
  preparePayload,
} from '../../../lib/utils';
import { routeConfig } from '../../../routes/routeConfig';
import { deleteStoreEntry, getStoreEntry, getStoreFlow } from '../../../store';

type ResponseData = {
  status: string;
  message: string | number;
};

const Page: NextPage<PageProps> = ({
  step,
  flow,
  entry,
  referenceNumber,
  url,
}) => {
  const heading = `layout.${flow}.title`;

  useContactFormsAnalytics({ step, entry, referenceNumber, url });

  return (
    <ContactFormsLayout
      step={step}
      heading={heading}
      hasTitle={false}
      hasLayoutContent={false}
    >
      <Confirmation
        step={step}
        entry={entry}
        referenceNumber={referenceNumber}
        flow={flow}
      />
    </ContactFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let responseData = {} as ResponseData;
  try {
    // Run any guards for the current step
    await runGuards(context, routeConfig);

    // Get the collected data from the store
    const key = getSessionId(context);
    const entry = await getStoreEntry(key);
    const flow = await getStoreFlow(context);
    const code = process.env.API_CODE;
    const url = process.env.API_URL;
    if (!code || !url) {
      throw new Error('API code or URL is not set in environment variables');
    }

    // Prepare the payload
    const payload = preparePayload(entry.data);
    console.info('Payload for debugging:', payload); // DEBUG

    const response = await fetch(`${url}?code=${code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    responseData = await response.json();

    if (!response.ok) {
      console.info('Submission failed:', responseData, response); // DEBUG
      throw new Error('Submission failed');
    }

    console.info('Submission sucess', responseData, response); // DEBUG

    // Return props for the page
    return {
      props: {
        step: getCurrentStep(context),
        flow,
        referenceNumber: responseData.message,
        entry,
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    console.warn('Error on confirmation page:', error); // DEBUG
    return {
      redirect: {
        destination: `./${StepName.ERROR}?status=${encodeURIComponent(
          responseData.message ?? '103',
        )}`,
        permanent: false,
      },
    };
  } finally {
    try {
      // Try to delete from store if possible
      await deleteStoreEntry(context);
    } catch (cleanupError) {
      // Optionally log cleanup errors, but don't throw
      console.warn('Cleanup error:', cleanupError);
    }
    // Always clear the cookie, even if store deletion fails
    context.res.setHeader(
      'Set-Cookie',
      'fsid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    );
  }
};

export default Page;
