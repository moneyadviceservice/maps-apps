import { GetServerSideProps } from 'next';

import { Organisations } from 'components/Organisations';
import Cookies from 'cookies';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { PageLayout } from 'layouts/PageLayout/PageLayout';
import { organisations } from 'lib/organisations';
import { ParsedUrlQuery } from 'querystring';
import {
  PageError,
  PageSectionTemplate,
  PageTemplate,
} from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import { OrgProps } from 'types/Organisations';
import { fetchPage, fetchSiteSettings } from 'utils/fetch';
import { getUrl } from 'utils/getUrl';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  page: {
    pageTemplate: PageTemplate;
    pageSectionTemplate: PageSectionTemplate;
  };
  slug: string[];
  lang: string;
  url: string;
  orgData?: OrgProps;
};

const Page = ({
  siteConfig,
  assetPath,
  page,
  lang,
  slug,
  url,
  orgData,
}: Props) => {
  const p = page?.pageTemplate ?? page?.pageSectionTemplate;
  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={p.title}
      breadcrumbs={p.breadcrumbs}
      lang={lang}
      slug={[`/what-is-the-sfs/${slug}`]}
    >
      {page.pageTemplate && (
        <PageLayout
          assetPath={assetPath}
          page={page.pageTemplate}
          lang={lang}
          slug={[`/what-is-the-sfs/${slug}`]}
          url={url}
        >
          {orgData && (
            <Organisations
              {...orgData}
              pagePath={`/${lang}/what-is-the-sfs/${slug}`}
              lang={lang}
            />
          )}
        </PageLayout>
      )}
    </BasePageLayout>
  );
};

export default Page;

type OrgSSRData = {
  query: ParsedUrlQuery;
  cookies: Cookies;
  preservedRecords?: string;
  preservedPages?: string;
  continuationTokens?: string;
};

const getOrgSSRData = async ({
  query,
  cookies,
  preservedRecords,
  preservedPages,
  continuationTokens,
}: OrgSSRData): Promise<OrgProps> => {
  const pageQuery = query.page as string;
  const isPaginationEvent = !!pageQuery;
  const page = pageQuery ?? '1';
  const pageNumber = parseInt(page);
  const name = (query.name as string) ?? '';
  const type = (query.type as string) ?? '';

  let tokenArray: string[] = [''];

  if (isPaginationEvent && continuationTokens) {
    try {
      tokenArray = JSON.parse(continuationTokens);
    } catch {
      tokenArray = [''];
    }
  }

  try {
    const data = await organisations({
      page,
      searchQuery: name,
      continuationToken: tokenArray[pageNumber - 1] ?? '',
      type,
    });

    const COOKIE_OPTIONS = {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    } as Cookies.SetOption;

    if (page === '1') {
      cookies.set('totalRecords', `${data.totalRecords}`, {
        ...COOKIE_OPTIONS,
      });

      cookies.set('totalPages', `${data.totalPages}`, {
        ...COOKIE_OPTIONS,
      });
    } else if (preservedRecords && preservedPages) {
      data.totalRecords = parseInt(preservedRecords);
      data.totalPages = parseInt(preservedPages);
    }

    tokenArray[pageNumber] = data.continuationToken ?? '';

    cookies.set('continuationTokens', JSON.stringify(tokenArray), {
      ...COOKIE_OPTIONS,
    });

    return {
      data: data?.data ?? [],
      totalPages: data?.totalPages ?? 1,
      totalRecords: data?.totalRecords ?? 0,
      currentPage: pageNumber,
      name,
      type,
      continuationToken: data?.continuationToken,
    };
  } catch (err) {
    console.error('Failed to fetch orgs:', err);
    return {
      data: [],
      totalPages: 1,
      totalRecords: 0,
      currentPage: 1,
      name,
      type,
    };
  }
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
  query,
}) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const slug = Array.isArray(params?.slug) ? params.slug : [];
  const siteConfig = await fetchSiteSettings(lang);
  const page = await fetchPage(lang, [`what-is-the-sfs>${slug[0]}`]);

  let orgData = {};
  if (slug[0] === 'public-organisations') {
    const cookies = new Cookies(req, res);
    const preservedRecords = req.cookies.totalRecords;
    const preservedPages = req.cookies.totalPages;
    const continuationTokens = req.cookies.continuationTokens;

    orgData = await getOrgSSRData({
      query,
      cookies,
      preservedRecords,
      preservedPages,
      continuationTokens,
    });
  }

  if ((page as PageError).error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang: lang,
      slug: slug ?? [''],
      page: page,
      url: getUrl(req),
      orgData: orgData,
    },
  };
};
