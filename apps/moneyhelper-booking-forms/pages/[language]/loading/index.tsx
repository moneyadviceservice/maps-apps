/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import {
  getStoreEntry,
  getStoreFlow,
  setStoreEntry,
} from '@maps-react/mhf/store';
import { PageProps } from '@maps-react/mhf/types';
import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils';

import { Loading } from '../../../components';
import { runGuards } from '../../../guards';
import { BookingFormsLayout } from '../../../layouts/BookingFormsLayout';
import { StepName } from '../../../lib/constants';
import { useBookingFormsAnalytics } from '../../../lib/hooks';
import { BookingEntry } from '../../../lib/types';

const Page: NextPage<PageProps> = ({ step, entry, url }) => {
  const lang = entry.data.lang || 'en';
  const redirect = `/${lang}/confirmation`;

  useBookingFormsAnalytics({ step, url });

  return (
    <BookingFormsLayout step={step} hasFullWidth={true}>
      <Loading step={step} />
      <meta httpEquiv="refresh" content={`2;url=${redirect}`} />
    </BookingFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Run any guards for the current step
    await runGuards(context);

    // Get the collected data from the store
    const key = getSessionId(context);
    if (!key) {
      throw new TypeError('[loading] Session ID not found');
    }

    // Increment the step index in the store entry
    const entry: BookingEntry = await getStoreEntry(key);
    entry.stepIndex++;
    await setStoreEntry(key, entry);

    // Return props for the page
    return {
      props: {
        step: getCurrentStep(context),
        flow: await getStoreFlow(context),
        entry,
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    console.warn('Error on loading page:', error); // DEBUG
    return {
      redirect: {
        destination: `./${StepName.ERROR}`,
        permanent: false,
      },
    };
  }
};

export default Page;
