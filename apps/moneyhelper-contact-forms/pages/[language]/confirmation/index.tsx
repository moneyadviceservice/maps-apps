/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { PageProps } from '../../../lib/types';
import { getCurrentStep, getSessionId } from '../../../lib/utils';
import { routeConfig } from '../../../routes/routeConfig';
import { getStoreEntry, getStoreFlow } from '../../../store';

const Page: NextPage<PageProps> = ({ step, flow, entry }) => {
  const { Component } = routeConfig[step] || {};

  if (!Component) {
    // Throw an error to trigger the default _error.tsx page
    throw new Error(`Component not found for step: ${step}`);
  }

  return (
    <ContactFormsLayout step={step} flow={flow}>
      <Component entry={entry} />
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

    // Convert the date of birth to a Date object
    const { day, month, year } = entry.data;
    const dob = new Date(Number(year), Number(month) - 1, Number(day));

    // Prepare the payload
    const payload = {
      enquirytype: entry.data.flow,
      firstname: entry.data['first-name'],
      lastname: entry.data['last-name'],
      dob,
      email: entry.data.email,
      phone: entry.data['phone-number'],
      postcode: entry.data['post-code'],
      enquiry: entry.data['text-area'],
      language: entry.data.lang,
    };
    console.log('Payload:', payload); // DEBUG

    // Return props for the page
    return {
      props: {
        step: getCurrentStep(context),
        flow: await getStoreFlow(context),
        entry,
      },
    };
  } catch (error) {
    console.warn('Error in getServerSideProps:', error); // DEBUG
    return {
      notFound: true, // Catch all errors and redirect to 404 page (_error.tsx)
    };
  }
};

export default Page;
