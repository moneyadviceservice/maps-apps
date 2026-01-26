/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import {
  getStoreEntry,
  getStoreErrors,
  getStoreFlow,
} from '@maps-react/mhf/store';
import { PageProps } from '@maps-react/mhf/types';
import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils/';
import { getBackStep } from '@maps-react/mhf/utils/getBackStep';

import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { HEADING_MAP, StepName } from '../../../lib/constants';
import { useContactFormsAnalytics } from '../../../lib/hooks';
import { routeConfig } from '../../../routes/routeConfig';

const Page: NextPage<PageProps> = ({
  step,
  backStep,
  errors,
  flow,
  entry,
  url,
}) => {
  const { Component } = routeConfig[step] || {};

  if (!Component) {
    throw new Error(`Component not found in flow: ${flow}, for step: ${step}`);
  }

  // Get any static headings based on the current step - otherwise return the flow name
  const getHeading = (step: string, flow: string) => HEADING_MAP[step] || flow;
  const heading = `layout.${getHeading(step, flow)}.title`;

  useContactFormsAnalytics({ step, entry, errors, url });

  return (
    <ContactFormsLayout
      back={backStep}
      errors={errors}
      step={step}
      heading={heading}
    >
      <Component errors={errors} entry={entry} flow={flow} step={step} />
    </ContactFormsLayout>
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
        destination: `./${StepName.ERROR}`,
        permanent: false,
      },
    };
  }
};

export default Page;
