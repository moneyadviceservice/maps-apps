import { NextPage } from 'next';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ErrorContent } from '../../../components/ErrorContent';
import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';

const Page: NextPage = () => {
  const { t, tList } = useTranslation();
  const title = t('pages.link-access-error.title');

  return (
    <PensionsDashboardLayout
      title={title}
      seoTitle={t('pages.link-access-error.page-title')}
      isOffset={false}
      enableTimeOut={false}
      isLoggedInPage={false}
    >
      <ErrorContent
        intro={t('pages.link-access-error.intro')}
        items={tList('pages.link-access-error.items')}
      />
    </PensionsDashboardLayout>
  );
};

export default Page;
