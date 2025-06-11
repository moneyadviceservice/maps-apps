/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { InsuranceType } from '../../../components';
import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { PageProps } from '../../../lib/types';
import { getBackStep, getCurrentStep } from '../../../lib/utils';
import { routeConfig } from '../../../routes/routeConfig';
import { getStoreErrors } from '../../../store';

const Page: NextPage<PageProps> = ({ step, backStep, errors }) => {
  return (
    <ContactFormsLayout
      back={backStep}
      errors={errors}
      step={step}
      heading={`layout.insurance-type.title`}
    >
      <InsuranceType errors={errors} />
    </ContactFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Run any guards for the current step
    await runGuards(context, routeConfig);

    // Return props for the page
    return {
      props: {
        step: getCurrentStep(context),
        backStep: await getBackStep(context),
        errors: await getStoreErrors(context),
      },
    };
  } catch (error) {
    console.warn('Error in getServerSideProps insurance type:', error); // DEBUG
    return {
      notFound: true, // Catch all errors and redirect to 404 page (_error.tsx)
      props: {},
    };
  }
};

export default Page;
