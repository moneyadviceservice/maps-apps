import { GetServerSideProps, NextPage } from 'next';

import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { storeCurrentUrl } from '../../../lib/utils';

const Page: NextPage<PensionsDashboardLayoutProps> = () => {
  const { t } = useTranslation();
  const title = t('pages.manage-pensions.title');

  return (
    <PensionsDashboardLayout>
      <Heading level="h1" className="mb-8 text-center">
        {title}
      </Heading>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  storeCurrentUrl(context);

  return {
    props: {},
  };
};
