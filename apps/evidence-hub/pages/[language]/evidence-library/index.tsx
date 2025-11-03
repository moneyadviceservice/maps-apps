import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

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
import {
  processFilterQuery,
  extractPaginationParams,
} from 'utils/queryProcessing';
import useTranslation from '@maps-react/hooks/useTranslation';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  documents: DocumentTemplate[];
  page: DocumentTemplate;
  lang: string;
  tags: TagGroup[];
  query: Record<string, string | string[] | undefined>;
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
  const router = useRouter();
  const { z } = useTranslation();

  const handlePageChange = (newPage: number) => {
    // Update URL with new page parameter
    const newQuery = { ...query, page: newPage.toString() };
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(newQuery)) {
      if (value) {
        searchParams.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    }

    // Navigate to new page
    router.push(`/${lang}/evidence-library?${searchParams.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    // Update URL with new limit parameter and reset to page 1
    const newQuery = { ...query, limit: newLimit.toString(), page: '1' };
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(newQuery)) {
      if (value) {
        searchParams.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    }

    // Navigate to new page with updated limit
    router.push(`/${lang}/evidence-library?${searchParams.toString()}`);
  };

  // Generate base URL for server-side pagination
  const baseUrl = `/${lang}/evidence-library`;

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
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        baseUrl={baseUrl}
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
  const { lang: _, page, limit, ...rawFilterQuery } = query;

  // Process filter query to handle array parameters and duplicate keys
  const filterQuery = processFilterQuery(rawFilterQuery);

  const result = await fetchDocumentsPaginated(filterQuery, validatedParams);
  const pageData = await fetchPage(lang, 'library');
  const breadcrumbs = (pageData as DocumentTemplate)?.breadcrumbs || [];

  if ('error' in result) {
    return {
      props: {
        siteConfig: siteConfig ?? {},
        assetPath: process.env.AEM_HOST_PUBLIC ?? '',
        lang,
        documents: [],
        tags: tags ?? [],
        query: query,
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
      query: query,
      breadcrumbs: breadcrumbs,
      pagination: result.pagination,
    },
  };
};
