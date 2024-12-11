import { GetServerSideProps, NextPage } from 'next';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { storeCurrentUrl } from '../../../lib/utils';

const Page: NextPage<PensionsDashboardLayoutProps> = () => {
  const { t, tList, locale } = useTranslation();
  const title = t('pages.welcome.title');

  const values = tList('pages.welcome.values.items');
  const excluded = tList('pages.welcome.excluded.items');

  return (
    <PensionsDashboardLayout title={title}>
      <div className="py-8 md:max-w-4xl">
        <Heading level="h2" className="mb-8">
          {t('pages.welcome.heading')}
        </Heading>

        <ToolIntro className="md:text-2xl">
          {t('pages.welcome.intro')}
        </ToolIntro>

        <Paragraph className="py-8">{t('pages.welcome.content')}</Paragraph>

        <Heading level="h6" className="mb-4">
          {t('pages.welcome.values.title')}
        </Heading>

        <ListElement
          items={values}
          variant="unordered"
          color="dark"
          className="ml-8"
        />

        <Heading level="h6" className="mt-8 mb-4">
          {t('pages.welcome.excluded.title')}
        </Heading>

        <ListElement
          items={excluded}
          variant="unordered"
          color="dark"
          className="ml-8"
        />

        <Link
          data-testid="welcome-button"
          href={`/${locale}/searching-for-your-pensions`}
          asButtonVariant="primary"
          className="mt-12"
        >
          {t('pages.welcome.form-button')}
        </Link>
      </div>
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
