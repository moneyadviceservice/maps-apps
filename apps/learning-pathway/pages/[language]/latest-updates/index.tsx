import { GetServerSideProps } from 'next';

import { BackToTop } from 'components/BackToTop';
import { BaseLayout } from 'layout/BasePageLayout/BaseLayout';
import TwoColumnLayout from 'layout/TwoColumnLayout/TwoColumnLayout';
import {
  SiteConfigType,
  UpdatePageModel,
  UpdateSectionModel,
} from 'lib/types/site.type';
import {
  fetchSideNavigation,
  fetchSiteSettings,
  fetchUpdatesPage,
} from 'lib/utils/fetchContent/fetchContent';

import { H2, H3, Heading, Link } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';
import { SideNavigationModel } from '@maps-react/mps/types';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText/RenderRichText';

type UpdatesPageProps = SiteConfigType & {
  pageContent: UpdatePageModel;
  assetPath: string;
  language: string;
  sideNavigation: SideNavigationModel | null;
};

const UpdateSection = ({
  section,
  assetPath,
}: {
  section: UpdateSectionModel;
  assetPath: string;
}) => {
  const id = section.slug ?? undefined;
  const updates = (section.updates ?? []).filter((update) =>
    Boolean(update.document?._path ?? update.linkUrl),
  );

  return (
    <section id={id} className="scroll-mt-4">
      <Heading
        level={section.headingLevel}
        data-testid={`heading-${id}`}
        className="text-gray-800 mb-4"
      >
        {section.sectionTitle}
      </Heading>

      {updates.length > 0 && (
        <>
          <ul
            data-testid={`updates-${id}`}
            className="ml-6 space-y-4 list-disc marker:text-blue-700"
          >
            {updates.map((update, index) => {
              const documentPath = update.document?._path;
              const href = documentPath
                ? `${assetPath}${documentPath}`
                : update.linkUrl ?? '';

              return (
                <li key={`${id}-${index}`}>
                  <Link href={href}>{update.linkTitle}</Link>
                </li>
              );
            })}
          </ul>
          <BackToTop testId={id ?? section.sectionTitle} />
        </>
      )}
    </section>
  );
};

const UpdatesPage = ({
  pageContent,
  assetPath,
  language,
  sideNavigation,
  ...siteConfig
}: UpdatesPageProps) => {
  const {
    seoTitle,
    seoDescription,
    pageTitle,
    anchorLinksTitle,
    guidanceTitle,
    introText,
    updateSections = [],
  } = pageContent;

  const { t } = useTranslation();

  const anchorSections = updateSections.filter(
    (section) => section.headingLevel === 'h3',
  );

  return (
    <BaseLayout
      siteConfig={siteConfig}
      bannerTitle={t('bannerTitle')}
      seoDescription={seoDescription}
      title={pageTitle}
      seoTitle={seoTitle}
      assetPath={assetPath}
      language={language}
      sideNavigation={sideNavigation}
      pageType="Document"
      categoryLevels={['Document']}
    >
      <TwoColumnLayout language={language} sideNavigation={sideNavigation}>
        <RichTextAem>
          {introText?.json && mapJsonRichText(introText.json)}
        </RichTextAem>

        {anchorSections.length > 0 && (
          <nav aria-labelledby="anchor-links-heading">
            <H3
              id="anchor-links-heading"
              data-testid="anchor-links-heading"
              className="text-gray-800 mb-4"
            >
              {anchorLinksTitle}
            </H3>
            <ul data-testid="anchor-links" className="border-t border-gray-300">
              {anchorSections.map((section) => {
                const id = section.slug;

                return (
                  <li key={id} className="border-b border-gray-300">
                    <Link
                      href={`#${id}`}
                      withIcon={false}
                      data-testid={`anchor-link-${id}`}
                      className="block py-2 no-underline hover:underline"
                    >
                      {section.sectionTitle}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {guidanceTitle && (
          <H2 data-testid="guidance-title" className="text-gray-800">
            {guidanceTitle}
          </H2>
        )}

        {updateSections.map((section) => (
          <UpdateSection
            key={section.slug ?? section.sectionTitle}
            section={section}
            assetPath={assetPath}
          />
        ))}
      </TwoColumnLayout>
    </BaseLayout>
  );
};

export default UpdatesPage;

export const getServerSideProps: GetServerSideProps<UpdatesPageProps> = async (
  context,
) => {
  const language = (context.params?.language as string) || 'en';

  const pageContent = await fetchUpdatesPage(language);

  if (!pageContent) {
    return { notFound: true };
  }

  const siteConfig = await fetchSiteSettings(language);
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
