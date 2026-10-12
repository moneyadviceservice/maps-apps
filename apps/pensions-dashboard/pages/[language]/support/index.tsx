import { GetServerSideProps, NextPage } from 'next';

import { H2 } from '@maps-react/common/components/Heading';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { OnwardJourneyBanner } from '../../../components/OnwardJourneyBanner';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { useMHPDAnalytics } from '../../../lib/hooks';
import {
  Cookies,
  getMhpdSessionConfig,
  storeCurrentUrl,
  withAuth,
} from '../../../lib/utils/system';
import image1 from '../../../public/images/support-card-1.webp';
import image2 from '../../../public/images/support-card-2.webp';
import image3 from '../../../public/images/support-card-3.webp';

type PageProps = {
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  backLink,
}) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'support/support.title';
  const title = t(titleKey);

  // Track analytics for this page
  useMHPDAnalytics({
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  return (
    <PensionsDashboardLayout
      title={title}
      back={`/${locale}${backLink}`}
      backText={t('support/back-text')}
      isOffset={false}
    >
      <div className="pt-2 md:pt-6 md:max-w-4xl">
        <ToolIntro className="mb-6 md:mb-8 md:text-2xl">
          {t('support/support.intro')}
        </ToolIntro>
      </div>

      <div data-testid="support-cards" className="mt-10">
        <H2 className="mb-8">{t('support/support.sub-title')}</H2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-3">
          <TeaserCard
            title={t('support/support.card-1.title')}
            image={image1}
            description={t('support/support.card-1.description')}
            href={`/${locale}/support/using-the-pensions-dashboard`}
            imageClassName="h-[212px] md:h-[237px]"
            headingLevel="h5"
            headingComponent="h3"
          />
          <TeaserCard
            title={t('support/support.card-2.title')}
            image={image2}
            description={t('support/support.card-2.description')}
            href={`/${locale}/support/understand-your-pensions`}
            imageClassName="h-[212px] md:h-[237px]"
            headingLevel="h5"
            headingComponent="h3"
          />
          <TeaserCard
            title={t('support/support.card-3.title')}
            image={image3}
            description={t('support/support.card-3.description')}
            href={`/${locale}/contact-us-form`}
            imageClassName="h-[212px] md:h-[237px]"
            headingLevel="h5"
            headingComponent="h3"
          />
        </div>
      </div>

      <div className="xl:grid xl:grid-cols-12">
        <div className="xl:col-span-8">
          <OnwardJourneyBanner className="mt-12 mb-6 md:mt-16 md:mb-16" />
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = withAuth((context) => {
  const cookies = new Cookies(context.req, context.res);
  const { currentUrl } = getMhpdSessionConfig(cookies);
  const backLink = currentUrl ?? null;
  storeCurrentUrl(context, undefined, true);

  return Promise.resolve({
    props: {
      backLink,
    },
  });
});
