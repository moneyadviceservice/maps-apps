/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { PensionsAndRetirement } from '../../../components';
import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { StepName } from '../../../lib/constants';
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
      heading={`layout.pensions-and-retirement.title`}
    >
      <PensionsAndRetirement errors={errors} />
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
    console.warn('Error in pensions-and-retirement page:', error); // DEBUG
    return {
      redirect: {
        destination: `./${StepName.ERROR}`,
        permanent: false,
      },
    };
  }
};

export default Page;
