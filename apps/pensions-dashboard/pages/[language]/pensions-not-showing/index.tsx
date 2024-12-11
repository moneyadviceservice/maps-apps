import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { EmbedMSForm } from '../../../components/EmbedMSForm';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';

type Props = {
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({ backLink }) => {
  const { t, locale } = useTranslation();
  const title = t('pages.pensions-not-showing.title');

  return (
    <PensionsDashboardLayout title={title}>
      <div className="py-8 md:max-w-4xl">
        <ToolIntro className="mb-8 md:text-2xl">
          {t('pages.pensions-not-showing.intro')}
        </ToolIntro>

        <Paragraph>{t('pages.pensions-not-showing.paragraph-1')}</Paragraph>

        <Paragraph>{t('pages.pensions-not-showing.paragraph-2')}</Paragraph>

        <EmbedMSForm
          src={t('pages.pensions-not-showing.form.src')}
          title={t('pages.pensions-not-showing.form.title')}
          id="not-showing-form"
          testId="not-showing-form"
          classNames="mt-10 h-[670px] sm:h-[610px] md:h-[590px] lg:h-[700px]"
        />
      </div>
      <Link asButtonVariant="primary" href={`/${locale}${backLink}`}>
        {t('site.back')}
      </Link>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  const backLink = cookies.get('currentUrl') ?? null;

  return {
    props: {
      backLink,
    },
  };
};
