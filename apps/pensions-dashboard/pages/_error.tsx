import { NextPage } from 'next';
import { PensionsDashboardLayout } from '../layouts/PensionsDashboardLayout';
import { Heading } from '@maps-react/common/components/Heading';
import { Markdown } from '@maps-react/vendor/components/Markdown';
import { PROTOCOL } from '../lib/constants';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  host: string;
};

const ErrorPage: NextPage<Props> = ({ host }) => {
  const { t } = useTranslation();

  return (
    <PensionsDashboardLayout title={t('pages.error.title')}>
      <p>{t('pages.error.intro')}</p>
      <Heading
        fontWeight="semi-bold"
        level="h3"
        component="h2"
        className="mt-10 mb-6"
      >
        {t('pages.error.what-you-can-do.title')}
      </Heading>
      <ul className="pl-10 space-y-1 list-disc">
        <li>{t('pages.error.what-you-can-do.item-1')}</li>
        <li>
          <Markdown
            className="mb-1"
            content={t('pages.error.what-you-can-do.item-2', {
              link: `${PROTOCOL}${host}/`,
            })}
          />
        </li>
        <li>{t('pages.error.what-you-can-do.item-3')}</li>
        <li>{t('pages.error.what-you-can-do.item-4')}</li>
      </ul>
    </PensionsDashboardLayout>
  );
};

export default ErrorPage;

ErrorPage.getInitialProps = ({ req }) => {
  return {
    host: req?.headers.host ?? '',
  };
};
