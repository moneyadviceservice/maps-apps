import { GetServerSideProps, NextPage } from 'next';

import { ResponseMessage } from '@maps-react/mhf/constants';
import { getStoreEntry, getStoreFlow } from '@maps-react/mhf/store';
import { cleanupSession } from '@maps-react/mhf/store/cleanupSession';
import { Entry, PageProps } from '@maps-react/mhf/types';
import { getSessionId } from '@maps-react/mhf/utils';

import { Confirmation } from '../../../components';
import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { StepName } from '../../../lib/constants';
import { useContactFormsAnalytics } from '../../../lib/hooks';
import { ContactResponseData } from '../../../lib/types';

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
  let responseData;
  try {
    // Run any guards for the current step
    await runGuards(context);

    // Get the collected data from the store
    const key = getSessionId(context);
    const entry: Entry = await getStoreEntry(key);
    const flow = await getStoreFlow(context);
    const meta = entry.meta;
    responseData = meta?.responseData as ContactResponseData;

    // If the response data indicates a failed submission, throw an error to trigger the error redirect
    if (!responseData?.status) {
      throw new Error('Response indicates failed submission');
    }

    // Return props for the page
    return {
      props: {
        step: StepName.CONFIRMATION,
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
          responseData?.message ?? ResponseMessage.GENERIC_ERROR,
        )}`,
        permanent: false,
      },
    };
  } finally {
    await cleanupSession(context);
  }
};

export default Page;
