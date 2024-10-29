import { NextPage } from 'next';
import { Markdown } from '@maps-react/vendor/components/Markdown';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';

const Page: NextPage<PensionsDashboardLayoutProps> = () => {
  const { t } = useTranslation();
  const title = t('pages.download-data.title');

  return (
    <PensionsDashboardLayout title={title}>
      <div className="text-center py-24">
        <Markdown content={t('pages.download-data.content')} />
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;
