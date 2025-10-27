import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { DocumentLayout } from 'layouts/DocumentLayout/DocumentLayout';
import { PageLayout } from 'layouts/PageLayout/PageLayout';
import { LinkType } from 'types/@adobe/components';
import { DocumentTemplate, PageTemplate } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchDocument, fetchPage, fetchSiteSettings } from 'utils/fetch';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  documentPage: DocumentTemplate | null;
  page: PageTemplate | null;
  breadcrumbs: LinkType[];
  lang: string;
};

const Page = ({
  siteConfig,
  assetPath,
  breadcrumbs,
  lang,
  documentPage,
  page,
}: Props) => {
  const shouldShowPageLayout = page && !documentPage?.pageType;

  return (
    <BasePageLayout
      pageTitle={documentPage?.title || page?.title || ''}
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={breadcrumbs}
      lang={lang}
    >
      {documentPage && <DocumentLayout page={documentPage} />}
      {shouldShowPageLayout && <PageLayout page={page} />}
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params, resolvedUrl } = context;
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const siteConfig = await fetchSiteSettings(lang);

  const query = Array.isArray(params?.slug)
    ? {
        slug: params.slug[1],
        pageType: params.slug[0],
      }
    : { slug: '', pageType: '' };

  const document = await fetchDocument('en', query);
  const documentError = 'error' in document;

  // Try to fetch page if document fetch failed, otherwise use "summary"
  const pageSlug = documentError ? query.pageType : 'summary';
  const page = await fetchPage(lang, pageSlug);
  const pageError = 'error' in page;

  // Extract breadcrumbs from successful page fetch
  const breadcrumbs = (page as PageTemplate)?.breadcrumbs || [];

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang,
      documentPage: documentError ? null : document,
      page: pageError ? null : page,
      breadcrumbs: [
        ...breadcrumbs,
        {
          linkTo: resolvedUrl.replace(/^\/[a-z]{2}\//, ''),
          text: lang === 'cy' ? 'Crynodeb Tystiolaeth' : 'Evidence Summary',
        },
      ],
    },
  };
};
