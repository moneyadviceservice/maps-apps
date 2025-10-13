/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { Guidance } from '../../../components';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { StepName } from '../../../lib/constants';
import { useContactFormsAnalytics } from '../../../lib/hooks';
import { PageProps } from '../../../lib/types';
import { getCurrentStep } from '../../../lib/utils';

const Page: NextPage<PageProps> = ({ step, url }) => {
  useContactFormsAnalytics({ step, url });

  return (
    <ContactFormsLayout step={step} heading="layout.title">
      <Guidance step={step} />
    </ContactFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    return {
      props: {
        step: getCurrentStep(context),
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    console.warn('Error on guidance page:', error); // DEBUG
    return {
      redirect: {
        destination: `./${StepName.ERROR}`,
        permanent: false,
      },
    };
  }
};

export default Page;
