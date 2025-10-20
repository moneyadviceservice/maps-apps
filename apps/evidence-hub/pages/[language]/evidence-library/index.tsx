import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { DocumentListLayout } from 'layouts/DocumentListLayout/DocumentListLayout';
import { LinkType } from 'types/@adobe/components';
import { DocumentTemplate, TagGroup } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import {
  fetchDocuments,
  fetchPage,
  fetchSiteSettings,
  getTags,
} from 'utils/fetch';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  documents: DocumentTemplate[];
  page: DocumentTemplate;
  lang: string;
  tags: TagGroup[];
  query: Record<string, string | string[] | undefined>;
  breadcrumbs: LinkType[];
};

const Page = ({
  siteConfig,
  assetPath,
  lang,
  page,
  documents,
  tags,
  query,
  breadcrumbs,
}: Props) => {
  return (
    <BasePageLayout
      pageTitle={page.title}
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={breadcrumbs}
      lang={lang}
    >
      <DocumentListLayout
        documents={documents}
        lang={lang}
        tags={tags}
        query={query}
      />
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params, query } = context;
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const siteConfig = await fetchSiteSettings(lang);
  const tags = await getTags(lang);

  // Remove language parameter from query before filtering
  const { lang: _, ...filterQuery } = query;
  const documents = await fetchDocuments(filterQuery);
  const page = await fetchPage(lang, 'library');
  const breadcrumbs = (page as DocumentTemplate)?.breadcrumbs || [];

  if ('error' in documents) {
    return {
      props: {
        siteConfig: siteConfig ?? {},
        assetPath: process.env.AEM_HOST_PUBLIC ?? '',
        lang,
        documents: [],
        tags: tags ?? [],
        query: query,
        breadcrumbs: breadcrumbs,
      },
    };
  }

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang,
      page: page as DocumentTemplate,
      documents: documents,
      tags: tags ?? [],
      query: query, // Pass query params to component
      breadcrumbs: breadcrumbs,
    },
  };
};
