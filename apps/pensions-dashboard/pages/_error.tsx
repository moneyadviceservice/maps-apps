import { NextPage } from 'next';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ErrorContent } from '../components/ErrorContent';
import { PensionsDashboardLayout } from '../layouts/PensionsDashboardLayout';

const ErrorPage: NextPage = () => {
  const { t, tList } = useTranslation();
  const items = tList('pages.error.what-you-can-do.items');

  return (
    <PensionsDashboardLayout
      title={t('pages.error.title')}
      isOffset={false}
      helpAndSupport
    >
      <ErrorContent items={items} />
    </PensionsDashboardLayout>
  );
};

export default ErrorPage;
