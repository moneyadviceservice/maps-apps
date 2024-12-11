import { GetServerSideProps, NextPage } from 'next';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { EmbedMSForm } from '../../../../components/EmbedMSForm';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import { storeCurrentUrl } from '../../../../lib/utils';

type Props = {
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({ backLink }) => {
  const { t, locale } = useTranslation();
  const title = t('pages.support.suggest-another-question.title');

  return (
    <PensionsDashboardLayout title={title}>
      <div className="py-8 md:max-w-4xl">
        <ToolIntro className="mb-8 md:text-2xl" testId="suggest-question-intro">
          {t('pages.support.suggest-another-question.intro')}
        </ToolIntro>

        <Paragraph>
          {t('pages.support.suggest-another-question.content')}
        </Paragraph>

        <Paragraph>
          {t('pages.support.suggest-another-question.thanks')}
        </Paragraph>

        <EmbedMSForm
          src={t(`pages.support.suggest-another-question.form.src`)}
          title={t(`pages.support.suggest-another-question.form.title`)}
          id="suggest-question-form"
          testId="suggest-question-form"
          classNames="mt-10 h-[670px] sm:h-[610px] md:h-[590px] lg:h-[700px]"
        />
      </div>
      <Link
        asButtonVariant="primary"
        href={`/${locale}/support/${backLink}`}
        data-testid="back"
      >
        {t('site.back')}
      </Link>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // work out the back link based on the referer
  // default to explore the pensions dashboard page if no referer (eg, copy/paste URL)
  const referer = context.req.headers.referer;

  // exclude these paths from the being a back link
  const excludedPaths = [
    'suggest-another-question',
    'you-have-been-inactive-for-a-while',
    'you-are-about-to-leave',
  ];
  const backLink =
    referer && !excludedPaths.some((path) => referer.includes(path))
      ? referer.split('/').pop()
      : 'explore-the-pensions-dashboard';
  storeCurrentUrl(context, true);

  return {
    props: {
      backLink,
    },
  };
};
