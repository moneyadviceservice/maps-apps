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
    <PensionsDashboardLayout title={title} isOffset={false}>
      <div className="md:max-w-4xl">
        <Heading level="h2" className="mb-6 md:mb-8 md:text-5xl">
          {t('pages.welcome.heading')}
        </Heading>

        <ToolIntro className="mb-6 leading-7 md:mb-8 md:text-2xl">
          {t('pages.welcome.intro')}
        </ToolIntro>

        <Paragraph className="mb-6">{t('pages.welcome.content')}</Paragraph>

        <Paragraph className="font-bold md:mb-6">
          {t('pages.welcome.values.title')}
        </Paragraph>

        <ListElement
          items={values}
          variant="unordered"
          color="blue"
          className="mb-6 ml-9 md:space-y-4"
        />

        <Paragraph className="font-bold md:mb-6">
          {t('pages.welcome.excluded.title')}
        </Paragraph>

        <ListElement
          items={excluded}
          variant="unordered"
          color="blue"
          className="mb-9 ml-9 md:space-y-4 md:mb-14"
        />

        <Link
          data-testid="welcome-button"
          href={`/${locale}/searching-for-your-pensions`}
          asButtonVariant="primary"
          className="justify-center w-full my-4 md:w-auto"
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
