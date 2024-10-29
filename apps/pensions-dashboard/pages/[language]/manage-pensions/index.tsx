import { NextPage } from 'next';
import { Heading } from '@maps-react/common/components/Heading';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import useTranslation from '@maps-react/hooks/useTranslation';

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
