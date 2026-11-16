import { NextPage } from 'next';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ErrorContent } from '../components/ErrorContent';
import { PensionsDashboardLayout } from '../layouts/PensionsDashboardLayout';

type ErrorPageProps = {
  userSessionId?: string;
};

const ErrorPage: NextPage<ErrorPageProps> = ({ userSessionId = '' }) => {
  const { t, tList } = useTranslation();
  const items = tList('pages.error.what-you-can-do.items');
  const hasSession = !!userSessionId;

  return (
    <PensionsDashboardLayout
      title={t('pages.error.title')}
      isOffset={false}
      helpAndSupport={hasSession}
      toTopLink={hasSession}
    >
      <ErrorContent items={items} />
    </PensionsDashboardLayout>
  );
};

export default ErrorPage;
