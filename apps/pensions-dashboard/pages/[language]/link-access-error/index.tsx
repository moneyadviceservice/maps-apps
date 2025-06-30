import { NextPage } from 'next';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ErrorContent } from '../../../components/ErrorContent';
import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';

const Page: NextPage = () => {
  const { t, tList } = useTranslation();
  return (
    <PensionsDashboardLayout
      title={t('pages.link-access-error.title')}
      seoTitle={t('pages.link-access-error.page-title')}
      isOffset={false}
    >
      <ErrorContent
        intro={t('pages.link-access-error.intro')}
        items={tList('pages.link-access-error.items')}
      />
    </PensionsDashboardLayout>
  );
};

export default Page;
