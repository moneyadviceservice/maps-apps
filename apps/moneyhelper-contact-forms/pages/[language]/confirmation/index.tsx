/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { getStoreEntry, getStoreFlow } from '@maps-react/mhf/store';
import { cleanupSession } from '@maps-react/mhf/store/cleanupSession';
import { PageProps } from '@maps-react/mhf/types';
import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils';

import { Confirmation } from '../../../components';
import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { StepName } from '../../../lib/constants';
import { useContactFormsAnalytics } from '../../../lib/hooks';
import { preparePayload } from '../../../lib/utils';

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
    await runGuards(context);

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

    const response = await fetch(`${url}?code=${code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    responseData = await response.json();

    if (!response.ok) {
      throw new Error('Submission failed');
    }

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
    await cleanupSession(context);
  }
};

export default Page;
