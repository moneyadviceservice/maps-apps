/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import {
  getStoreEntry,
  getStoreErrors,
  getStoreFlow,
} from '@maps-react/mhf/store';
import { PageProps } from '@maps-react/mhf/types';
import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils';
import { getBackStep } from '@maps-react/mhf/utils/getBackStep';

import { runGuards } from '../../../guards';
import { BookingFormsLayout } from '../../../layouts/BookingFormsLayout';
import { useBookingFormsAnalytics } from '../../../lib/hooks';
import { getErrorRedirect } from '../../../lib/utils/getErrorRedirect';
import { routeConfig } from '../../../routes/routeConfig';

const Page: NextPage<PageProps> = ({
  step,
  backStep,
  errors,
  entry,
  url,
  flow,
}) => {
  const { Component } = routeConfig[step] || {};

  if (!Component) {
    throw new TypeError(
      `Component not found in flow: ${flow}, for step: ${step}`,
    );
  }

  useBookingFormsAnalytics({ step, entry, errors, url });

  return (
    <BookingFormsLayout back={backStep} errors={errors} step={step} flow={flow}>
      <Component errors={errors} entry={entry} step={step} />
    </BookingFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let step = 'generic';
  try {
    // Run any guards for the current step
    await runGuards(context);

    // Get the collected data from the store
    const key = getSessionId(context);
    const entry = await getStoreEntry(key);
    step = getCurrentStep(context);

    return {
      props: {
        step,
        backStep: await getBackStep(context),
        errors: await getStoreErrors(context),
        flow: await getStoreFlow(context),
        entry,
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    console.warn(`Error on ${step} page:`, error); // DEBUG
    return {
      redirect: {
        destination: getErrorRedirect(context),
        permanent: false,
      },
    };
  }
};

export default Page;
