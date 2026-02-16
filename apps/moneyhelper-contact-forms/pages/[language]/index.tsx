import { GetServerSideProps, NextPage } from 'next';

import { PageProps } from '@maps-react/mhf/types';

import { Guidance } from '../../components';
import { ContactFormsLayout } from '../../layouts/ContactFormsLayout';
import { StepName } from '../../lib/constants';
import { useContactFormsAnalytics } from '../../lib/hooks';

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
        step: StepName.GUIDANCE,
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    console.warn('Error on index page:', error); // DEBUG
    return {
      redirect: {
        destination: `./${StepName.ERROR}`,
        permanent: false,
      },
    };
  }
};

export default Page;
