/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { PageProps } from '../../../lib/types';
import { getBackStep, getCurrentStep, getSessionId } from '../../../lib/utils';
import { routeConfig } from '../../../routes/routeConfig';
import { getStoreEntry, getStoreErrors, getStoreFlow } from '../../../store';

const Page: NextPage<PageProps> = ({ step, backStep, errors, flow, entry }) => {
  const { Component } = routeConfig[step] || {};

  if (!Component) {
    // Throw an error to trigger the default _error.tsx page
    throw new Error(`Component not found for step: ${step}`);
  }

  return (
    <ContactFormsLayout back={backStep} errors={errors} step={step} flow={flow}>
      <Component errors={errors} entry={entry} flow={flow} />
    </ContactFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Run any guards for the current step
    await runGuards(context, routeConfig);

    // Get the collected data from the store
    const key = getSessionId(context);
    const { entry } = await getStoreEntry(key);

    // Return props for the page
    return {
      props: {
        step: getCurrentStep(context),
        backStep: await getBackStep(context),
        errors: await getStoreErrors(context),
        flow: await getStoreFlow(context),
        entry,
      },
    };
  } catch (error) {
    console.warn('Error in getServerSideProps:', error); // DEBUG
    return {
      notFound: true, // Catch all errors and redirect to 404 page (_error.tsx)
      props: {},
    };
  }
};

export default Page;
