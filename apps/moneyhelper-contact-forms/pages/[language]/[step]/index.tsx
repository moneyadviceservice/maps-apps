/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { HEADING_MAP, StepName } from '../../../lib/constants';
import { PageProps } from '../../../lib/types';
import { getBackStep, getCurrentStep, getSessionId } from '../../../lib/utils';
import { routeConfig } from '../../../routes/routeConfig';
import { getStoreEntry, getStoreErrors, getStoreFlow } from '../../../store';

const Page: NextPage<PageProps> = ({ step, backStep, errors, flow, entry }) => {
  const { Component } = routeConfig[step] || {};

  if (!Component) {
    throw new Error(`Component not found in flow: ${flow}, for step: ${step}`);
  }

  // Get any static headings based on the current step - otherwise return the flow name
  const getHeading = (step: string, flow: string) => HEADING_MAP[step] || flow;

  return (
    <ContactFormsLayout
      back={backStep}
      errors={errors}
      step={step}
      heading={`layout.${getHeading(step, flow)}.title`}
    >
      <Component errors={errors} entry={entry} flow={flow} step={step} />
    </ContactFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let step: string | undefined = undefined;
  try {
    // Run any guards for the current step
    await runGuards(context, routeConfig);

    // Get the collected data from the store
    const key = getSessionId(context);
    const { entry } = await getStoreEntry(key);
    step = getCurrentStep(context);

    return {
      props: {
        step,
        backStep: await getBackStep(context),
        errors: await getStoreErrors(context),
        flow: await getStoreFlow(context),
        entry,
      },
    };
  } catch (error) {
    console.warn(`Error on ${step ?? 'generic'} page:`, error); // DEBUG
    return {
      redirect: {
        destination: `./${StepName.ERROR}`,
        permanent: false,
      },
    };
  }
};

export default Page;
