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
import { type Pagination as PaginationType } from '@maps-react/utils/pagination';
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
  const title = z({ en: 'Research Library', cy: 'Llyfrgell Ymchwil' });

  return (
    <BasePageLayout
      pageTitle={page.title}
      bannerTitle={title}
      siteConfig={siteConfig}
      categoryLevels={[title]}
      pageType={title}
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

  const validatedParams = extractPaginationParams(query);
  const { lang: _, p, limit, ...rawFilterQuery } = query;
  const filterQuery = processFilterQuery(rawFilterQuery);
  const filterQueryWithDefaults = buildQueryWithDefaults(filterQuery);
  const queryWithDefaults = buildQueryWithDefaults(query);

  const [siteConfig, tags, pageData, result] = await Promise.all([
    fetchSiteSettings(lang),
    getTags(lang),
    fetchPage(lang, 'library'),
    fetchDocumentsPaginated(filterQueryWithDefaults, validatedParams),
  ]);

  const breadcrumbs = (pageData as DocumentTemplate)?.breadcrumbs || [];

  if ('error' in result) {
    return {
      props: {
        siteConfig: siteConfig ?? {},
        assetPath: process.env.AEM_HOST_PUBLIC ?? '',
        lang,
        documents: [],
        tags: tags ?? [],
        query: queryWithDefaults,
        breadcrumbs,
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
      breadcrumbs,
      pagination: result.pagination,
    },
  };
};
