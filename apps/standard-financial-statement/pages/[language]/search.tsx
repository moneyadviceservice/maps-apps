import { GetServerSideProps } from 'next';

import { SearchResults } from 'components/SearchResults';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { getUserSession } from 'lib/auth/sessionManagement/getUserSession';
import { twMerge } from 'tailwind-merge';
import { SearchResult } from 'types/@adobe/search';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchSearch, fetchSiteSettings } from 'utils/fetch';

import { H1 } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  lang: string;
  searchText: string;
  searchResult: SearchResult;
  isAuthenticated: boolean;
};

const Page = ({
  siteConfig,
  assetPath,
  searchText,
  searchResult,
  lang,
  isAuthenticated,
}: Props) => {
  const { z } = useTranslation();
  const title = z({
    en: 'Search',
    cy: 'Canlyniadau',
  });
  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={[
        {
          text: title,
          description: '',
          linkTo: '/search',
        },
      ]}
      slug={['/search']}
      lang={lang}
      pageTitle={title}
      isAuthenticated={isAuthenticated}
      pageType="Search result page"
    >
      <Container className="max-w-[1272px]">
        <div className={twMerge(['mt-8 lg:mt-16 lg:gap-16'])}>
          <H1 className="mb-4">{title}</H1>
          <SearchResults searchText={searchText} searchResult={searchResult} />
        </div>
      </Container>
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

  const session = await getUserSession(context);
  const isAuthenticated = !!session?.isAuthenticated;

  const searchResult = await fetchSearch({
    search: (query.q as string) ?? '',
    lang,
    auth: isAuthenticated,
  });

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang,
      searchResult: searchResult ?? [],
      searchText: query.q ?? '',
      isAuthenticated: isAuthenticated,
    },
  };
};
