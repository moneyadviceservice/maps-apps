import { GetServerSideProps } from 'next';

import { BackToTop } from 'components/BackToTop';
import { BaseLayout } from 'layout/BasePageLayout/BaseLayout';
import TwoColumnLayout from 'layout/TwoColumnLayout/TwoColumnLayout';
import { FrameworkPageModel, SiteConfigType } from 'lib/types/site.type';
import {
  fetchFrameworkPage,
  fetchSideNavigation,
  fetchSiteSettings,
} from 'lib/utils/fetchContent/fetchContent';

import useTranslation from '@maps-react/hooks/useTranslation';
import { SideNavigationModel } from '@maps-react/mps/types';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText/RenderRichText';

type FrameworkPageProps = SiteConfigType & {
  pageContent: FrameworkPageModel;
  assetPath: string;
  language: string;
  sideNavigation: SideNavigationModel | null;
};

const FrameworkPage = ({
  pageContent,
  assetPath,
  language,
  sideNavigation,
  ...siteConfig
}: FrameworkPageProps) => {
  const { seoTitle, seoDescription, pageTitle, frameworkSummary } = pageContent;
  const { t } = useTranslation();

  return (
    <BaseLayout
      bannerTitle={t('bannerTitle')}
      siteConfig={siteConfig}
      seoDescription={seoDescription}
      title={pageTitle}
      seoTitle={seoTitle}
      assetPath={assetPath}
      language={language}
      sideNavigation={sideNavigation}
      pageType="Framework"
      categoryLevels={['Framework']}
    >
      <TwoColumnLayout language={language} sideNavigation={sideNavigation}>
        <RichTextAem>
          {frameworkSummary?.json && mapJsonRichText(frameworkSummary.json)}
        </RichTextAem>

        <BackToTop testId="framework" />
      </TwoColumnLayout>
    </BaseLayout>
  );
};

export default FrameworkPage;

export const getServerSideProps: GetServerSideProps<
  FrameworkPageProps
> = async (context) => {
  const language = (context.params?.language as string) || 'en';

  const siteConfig = await fetchSiteSettings(language);
  const pageContent = await fetchFrameworkPage(language);
  const sideNavigation = await fetchSideNavigation(language);

  if (!siteConfig || !pageContent) {
    return { notFound: true };
  }

  return {
    props: {
      ...siteConfig,
      pageContent,
      language,
      sideNavigation,
      assetPath: process.env.AEM_HOST ?? '',
    },
  };
};
