/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { EnquiryType } from '../../../components';
import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { StepName } from '../../../lib/constants';
import { PageProps } from '../../../lib/types';
import { getCurrentStep } from '../../../lib/utils';
import { routeConfig } from '../../../routes/routeConfig';
import { getStoreErrors } from '../../../store';

const Page: NextPage<PageProps> = ({ step, backStep, errors }) => {
  return (
    <ContactFormsLayout back={backStep} errors={errors} step={step}>
      <EnquiryType errors={errors} step={step} />
    </ContactFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Run any guards for the current step
    await runGuards(context, routeConfig);

    return {
      props: {
        step: getCurrentStep(context),
        backStep: StepName.GUIDANCE,
        errors: await getStoreErrors(context),
      },
    };
  } catch (error) {
    console.warn('Error on enquiry-type page:', error); // DEBUG
    return {
      redirect: {
        destination: `./${StepName.ERROR}`,
        permanent: false,
      },
    };
  }
};

export default Page;
