import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { DocumentListLayout } from 'layouts/DocumentListLayout/DocumentListLayout';
import { LinkType } from 'types/@adobe/components';
import { DocumentTemplate, TagGroup } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import {
  fetchDocumentsPaginated,
  fetchPage,
  fetchSiteSettings,
  getTags,
} from 'utils/fetch';
import { Pagination as PaginationType } from 'utils/pagination/paginationUtils';
import { buildQueryWithDefaults, QueryParams } from 'utils/query/queryHelpers';
import {
  extractPaginationParams,
  processFilterQuery,
} from 'utils/queryProcessing';

import useTranslation from '@maps-react/hooks/useTranslation';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  documents: DocumentTemplate[];
  page: DocumentTemplate;
  lang: string;
  tags: TagGroup[];
  query: QueryParams;
  breadcrumbs: LinkType[];
  pagination: PaginationType;
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
  pagination,
}: Props) => {
  const { z } = useTranslation();

  return (
    <BasePageLayout
      pageTitle={page.title}
      bannerTitle={z({ en: 'Evidence library', cy: 'Evidence library' })}
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
        pagination={pagination}
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

  // Extract and validate pagination parameters
  const validatedParams = extractPaginationParams(query);

  // Remove language and pagination parameters from filter query
  const { lang: _, p, limit, ...rawFilterQuery } = query;

  // Process filter query to handle array parameters and duplicate keys
  const filterQuery = processFilterQuery(rawFilterQuery);

  // Apply defaults using shared utility (handles order/keyword logic)
  const filterQueryWithDefaults = buildQueryWithDefaults(filterQuery);

  const result = await fetchDocumentsPaginated(
    filterQueryWithDefaults,
    validatedParams,
  );
  const pageData = await fetchPage(lang, 'library');
  const breadcrumbs = (pageData as DocumentTemplate)?.breadcrumbs || [];

  // Pass query with defaults to component so it displays the correct selected value
  const queryWithDefaults = buildQueryWithDefaults(query);

  if ('error' in result) {
    return {
      props: {
        siteConfig: siteConfig ?? {},
        assetPath: process.env.AEM_HOST_PUBLIC ?? '',
        lang,
        documents: [],
        tags: tags ?? [],
        query: queryWithDefaults,
        breadcrumbs: breadcrumbs,
        pagination: null,
      },
    };
  }

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang,
      page: pageData as DocumentTemplate,
      documents: result.items,
      tags: tags ?? [],
      query: queryWithDefaults,
      breadcrumbs: breadcrumbs,
      pagination: result.pagination,
    },
  };
};
