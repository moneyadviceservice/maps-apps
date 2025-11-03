/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { EnquiryType } from '../../../components';
import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { StepName } from '../../../lib/constants';
import { useContactFormsAnalytics } from '../../../lib/hooks';
import { PageProps } from '../../../lib/types';
import { getCurrentStep } from '../../../lib/utils';
import { routeConfig } from '../../../routes/routeConfig';
import { getStoreErrors } from '../../../store';

const Page: NextPage<PageProps> = ({ step, errors, url }) => {
  useContactFormsAnalytics({ step, errors, url });

  return (
    <ContactFormsLayout errors={errors} step={step} heading="layout.title">
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
        url: context.resolvedUrl,
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
