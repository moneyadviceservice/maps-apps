import { GetServerSideProps } from 'next';

import { ActivitySetList } from 'components/ActivitySetList';
import { BackToTop } from 'components/BackToTop';
import { BaseLayout } from 'layout/BasePageLayout/BaseLayout';
import TwoColumnLayout from 'layout/TwoColumnLayout/TwoColumnLayout';
import { SiteConfigType, StartPageModel } from 'lib/types/site.type';
import {
  fetchSideNavigation,
  fetchSiteSettings,
  fetchStartPage,
} from 'lib/utils/fetchContent/fetchContent';

import {
  Button,
  Callout,
  CalloutVariant,
  H3,
  H4,
} from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';
import { SideNavigationModel } from '@maps-react/mps/types';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText/RenderRichText';

type StartPageProps = SiteConfigType & {
  pageContent: StartPageModel;
  assetPath: string;
  language: string;
  sideNavigation: SideNavigationModel | null;
};

const TOOL_START_STEP = 1;

const TOOL_DATA = {
  toolName: 'Learning pathway',
  toolCategory: 'Tools and research',
  toolStep: TOOL_START_STEP,
  stepName: 'Learning pathway hub -- Landing Page',
};

const StartPage = ({
  pageContent,
  assetPath,
  language,
  sideNavigation,
  ...siteConfig
}: StartPageProps) => {
  const { t, locale } = useTranslation();
  const {
    seoTitle,
    seoDescription,
    bannerTitle,
    startPageActivityHeading,
    startPageIntro,
    startPageActivitySetsHeading,
    startPageActivitySetsInformation,
    activitySets,
    informationalCalloutTitle,
    informationalCallout,
  } = pageContent;

  return (
    <BaseLayout
      siteConfig={siteConfig}
      bannerTitle={bannerTitle || t('bannerTitle')}
      seoDescription={seoDescription}
      title={startPageActivityHeading}
      seoTitle={seoTitle}
      assetPath={assetPath}
      language={language}
      sideNavigation={sideNavigation}
      pageType="Tools and research"
      categoryLevels={['Tools and research']}
      toolStartRestart
      currentStep={TOOL_START_STEP}
      toolData={TOOL_DATA}
    >
      <TwoColumnLayout language={language} sideNavigation={sideNavigation}>
        <RichTextAem>
          {startPageIntro?.json && mapJsonRichText(startPageIntro.json)}
        </RichTextAem>

        <section>
          {startPageActivitySetsHeading && (
            <H3
              data-testid="heading-activity-sets"
              className="text-gray-800 text-3xl md:text-4xl font-bold mb-4"
            >
              {startPageActivitySetsHeading}
            </H3>
          )}
          <RichTextAem>
            {startPageActivitySetsInformation?.json &&
              mapJsonRichText(startPageActivitySetsInformation.json)}
          </RichTextAem>

          {activitySets?.length > 0 && (
            <div className="mt-6">
              <ActivitySetList
                items={activitySets}
                keyHeading={t('start-page.activity-set-heading')}
                valueHeading={t('start-page.definition-heading')}
                testId="activity-sets"
              />
            </div>
          )}
        </section>

        <BackToTop testId="start-page" />

        {(informationalCalloutTitle || informationalCallout?.json) && (
          <Callout
            variant={CalloutVariant.WARNING}
            testId="informational-callout"
          >
            {informationalCalloutTitle && (
              <H4 className="p-2 text-gray-800">{informationalCalloutTitle}</H4>
            )}
            {informationalCallout?.json && (
              <div className="p-2">
                <RichTextAem>
                  {mapJsonRichText(informationalCallout.json)}
                </RichTextAem>
              </div>
            )}
          </Callout>
        )}

        <Button
          as="a"
          href={`/${locale}/learning-pathway`}
          variant="primary"
          data-testid="learning-pathway-hub-button"
        >
          {t('start-page.learning-pathway-hub')}
        </Button>
      </TwoColumnLayout>
    </BaseLayout>
  );
};

export default StartPage;

export const getServerSideProps: GetServerSideProps<StartPageProps> = async (
  context,
) => {
  const language = (context.params?.language as string) || 'en';

  const siteConfig = await fetchSiteSettings(language);
  const pageContent = await fetchStartPage(language);
  const sideNavigation = await fetchSideNavigation(language);

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
