import { useMemo } from 'react';

import { GetServerSideProps } from 'next';

import { BackToTop } from 'components/BackToTop';
import { BaseLayout } from 'layout/BasePageLayout/BaseLayout';
import TwoColumnLayout from 'layout/TwoColumnLayout/TwoColumnLayout';
import { DetailsPageModel, SiteConfigType } from 'lib/types/site.type';
import {
  fetchDetailsPage,
  fetchSideNavigation,
  fetchSiteSettings,
} from 'lib/utils/fetchContent/fetchContent';
import { filterTags, normalizeDate } from 'lib/utils/pageFilter/pageFilter';

import { H3 } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';
import { SideNavigationModel } from '@maps-react/mps/types';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import {
  mapJsonRichText,
  Node,
} from '@maps-react/vendor/utils/RenderRichText/RenderRichText';

type DetailsPageProps = SiteConfigType & {
  pageDetails: DetailsPageModel;
  assetPath: string;
  language: string;
  sideNavigation: SideNavigationModel | null;
};

const MainContent = ({
  text,
  title,
  testId,
}: {
  text: Node[];
  title?: string;
  testId: string;
}) => {
  return text ? (
    <div>
      {title && (
        <H3
          data-testid={`heading-${testId}`}
          className="text-blue-700 text-xl md:text-2xl font-bold mb-4"
        >
          {title}
        </H3>
      )}
      <RichTextAem> {mapJsonRichText(text)}</RichTextAem>
      <BackToTop testId={testId} />
    </div>
  ) : null;
};

const DetailsPage = ({
  pageDetails,
  assetPath,
  language,
  sideNavigation,
  ...siteConfig
}: DetailsPageProps) => {
  const {
    seoTitle,
    seoDescription,
    pageTitle,
    pageTags,
    owner,
    dateAccredited,
    dateLaunched,
    preRequisite,
    furtherInfo,
    descriptionTitle,
    description,
    preRequisiteSection,
    individualCertification,
    outcomeTitle,
    outcomesSection,
  } = pageDetails;

  const { t, locale } = useTranslation();
  const filteredTags = useMemo(
    () => filterTags(pageTags, locale),
    [pageTags, locale],
  );

  const keyInfoParams = {
    tags: filteredTags,
    owner: owner,
    dateAccredited: dateAccredited,
    dateLaunched: dateLaunched,
    preRequisite: preRequisite,
    furtherInfo: furtherInfo?.json,
    title: t('details-page.keyInfo'),
    ownerTitle: t('document-pages.ownerTitle'),
    accreditedDateTitle: t('details-page.dateAccreditedTitle'),
    launchedDateTitle: t('document-pages.dateLaunchedTitle'),
    furtherInfoTitle: t('details-page.furtherLinksTitle'),
    preRequisiteTitle: t('details-page.prerequisitesTitle'),
  };

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
      pageType="Quality updates"
      categoryLevels={['Quality updates']}
    >
      <TwoColumnLayout
        language={language}
        sideNavigation={sideNavigation}
        keyInfo={keyInfoParams}
      >
        <MainContent
          text={description?.json}
          title={descriptionTitle}
          testId="description"
        />
        <MainContent text={preRequisiteSection?.json} testId="prerequisites" />
        <MainContent
          text={individualCertification?.json}
          testId="individual-certification"
        />
        <MainContent
          text={outcomesSection?.json}
          title={outcomeTitle}
          testId="outcomes"
        />
      </TwoColumnLayout>
    </BaseLayout>
  );
};

export default DetailsPage;

export const getServerSideProps: GetServerSideProps<DetailsPageProps> = async (
  context,
) => {
  const language = (context.params?.language as string) || 'en';
  const slug = context.params?.slug as string;

  const [siteConfig, pageDetails, sideNavigation] = await Promise.all([
    fetchSiteSettings(language),
    fetchDetailsPage(language, slug),
    fetchSideNavigation(language),
  ]);
  if (pageDetails) {
    (pageDetails as DetailsPageModel).dateAccredited = normalizeDate(
      (pageDetails as DetailsPageModel).dateAccredited,
    );
    (pageDetails as DetailsPageModel).dateLaunched = normalizeDate(
      (pageDetails as DetailsPageModel).dateLaunched,
    );
  }

  return {
    props: {
      ...siteConfig,
      pageDetails,
      language,
      sideNavigation,
      assetPath: process.env.AEM_HOST ?? '',
    },
  };
};
