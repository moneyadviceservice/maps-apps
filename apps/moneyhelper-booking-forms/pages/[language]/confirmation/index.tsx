import { GetServerSideProps, NextPage } from 'next';

import { getStoreEntry, getStoreFlow } from '@maps-react/mhf/store';
import { cleanupSession } from '@maps-react/mhf/store/cleanupSession';
import { PageProps } from '@maps-react/mhf/types';
import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils';

import { Confirmation } from '../../../components';
import { runGuards } from '../../../guards';
import { BookingFormsLayout } from '../../../layouts/BookingFormsLayout/BookingFormsLayout';
import {
  ResponseMessage,
  StepName,
  SubmissionState,
} from '../../../lib/constants';
import { useBookingFormsAnalytics } from '../../../lib/hooks';
import { ResponseData, SubmissionEntry } from '../../../lib/types';

const Page: NextPage<PageProps> = ({
  step,
  flow,
  entry,
  referenceNumber,
  url,
}) => {
  useBookingFormsAnalytics({ step, entry, referenceNumber, url });

  return (
    <BookingFormsLayout step={step} heading={''}>
      <Confirmation
        step={step}
        entry={entry}
        flow={flow}
        referenceNumber={referenceNumber}
      />
    </BookingFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let responseData = {} as ResponseData;
  try {
    // Run any guards for the current step
    await runGuards(context);

    // Get the collected data from the store
    const key = getSessionId(context);
    const entry = (await getStoreEntry(key)) as SubmissionEntry;
    const flow = await getStoreFlow(context);
    const meta = entry.meta;

    // If there is no meta or the submission did not succeed, redirect to the error page
    if (meta?.submissionState !== SubmissionState.SUCCEEDED) {
      throw new Error('Submission failed');
    }
    responseData = meta.responseData as ResponseData;

    // Return props for the page
    return {
      props: {
        step: getCurrentStep(context),
        flow,
        referenceNumber: 'Test: 123446',
        // referenceNumber: responseData.message,
        entry,
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    console.warn('Error on confirmation page:', error); // DEBUG
    return {
      redirect: {
        destination: `./${StepName.ERROR}?status=${encodeURIComponent(
          responseData.message ?? ResponseMessage.GENERIC_ERROR,
        )}`,
        permanent: false,
      },
    };
  } finally {
    await cleanupSession(context);
  }
};

export default Page;
