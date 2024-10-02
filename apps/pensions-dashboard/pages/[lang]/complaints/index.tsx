import { GetServerSideProps, NextPage } from 'next';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';

const Page: NextPage<PensionsDashboardLayoutProps> = ({ title }) => {
  return (
    <PensionsDashboardLayout title={title}>
      <Paragraph className="text-center py-24">
        A page to download data
      </Paragraph>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      title: `Complaints`,
    },
  };
};
