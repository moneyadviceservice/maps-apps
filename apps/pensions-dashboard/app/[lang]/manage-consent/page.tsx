import { Metadata, NextPage } from 'next';
import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';
import { SITE_TITLE } from '../../../utils/constants';
import { Paragraph } from '@maps-digital/ui/components/Paragraph';

const title = 'Manage Consent';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: `${title} | ${SITE_TITLE}`,
  };
};

const Page: NextPage = async () => {
  return (
    <PensionsDashboardLayout title={title}>
      <Paragraph className="text-center py-24">
        A page to manage consent
      </Paragraph>
    </PensionsDashboardLayout>
  );
};

export default Page;
