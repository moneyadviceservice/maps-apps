import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { DocumentListLayout } from 'layouts/DocumentListLayout/DocumentListLayout';
import { DocumentTemplate, Tag } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchDocuments, fetchSiteSettings, getTags } from 'utils/fetch';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  documents: DocumentTemplate[];
  lang: string;
  tags: {
    label: string;
    tags: Tag[];
  }[];
  query: Record<string, string | string[] | undefined>;
};

const Page = ({
  siteConfig,
  assetPath,
  lang,
  documents,
  tags,
  query,
}: Props) => {
  return (
    <BasePageLayout
      pageTitle="Evidence Hub"
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={[]}
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

  if ('error' in documents) {
    return {
      props: {
        siteConfig: siteConfig ?? {},
        assetPath: process.env.AEM_HOST_PUBLIC ?? '',
        lang,
        documents: [],
        tags: tags ?? [],
        query: query,
      },
    };
  }

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang,
      documents: documents,
      tags: tags ?? [],
      query: query, // Pass query params to component
    },
  };
};
