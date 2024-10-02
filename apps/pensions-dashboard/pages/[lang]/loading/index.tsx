import { NextPage, GetServerSideProps } from 'next';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { Heading } from '@maps-react/common/components/Heading';
import { Loader } from '../../../components/Loader';

const Page: NextPage<PensionsDashboardLayoutProps> = ({ title }) => {
  return (
    <PensionsDashboardLayout>
      <Heading level="h1" className="mb-8 text-center">
        {title}
      </Heading>
      <Loader duration={Number(process.env.NEXT_PUBLIC_MHPD_LOAD_DURATION)} />
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      title: 'Searching for your pensions',
    },
  };
};
