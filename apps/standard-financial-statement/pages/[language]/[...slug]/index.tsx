import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { PageLayout } from 'layouts/PageLayout/PageLayout';
import { PageSectionLayout } from 'layouts/PageSectionLayout/PageSectionLayout';
import { getUserSession } from 'lib/auth/sessionManagement/getUserSession';
import {
  PageError,
  PageSectionTemplate,
  PageTemplate,
} from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
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
  isAuthenticated: boolean;
};

const Page = ({
  siteConfig,
  assetPath,
  page,
  lang,
  slug,
  url,
  isAuthenticated,
}: Props) => {
  const p = page?.pageTemplate ?? page?.pageSectionTemplate;
  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={p.title}
      breadcrumbs={p.breadcrumbs}
      lang={lang}
      slug={[`/${slug}`]}
      isAuthenticated={isAuthenticated}
      categoryLevels={[]}
      pageType="Apply to use the SFS"
    >
      {page.pageTemplate && (
        <PageLayout
          assetPath={assetPath}
          page={page.pageTemplate}
          lang={lang}
          slug={[`/${slug}`]}
          url={url}
        />
      )}
      {page.pageSectionTemplate && (
        <PageSectionLayout
          page={page.pageSectionTemplate}
          lang={lang}
          slug={[`/${slug}`]}
          url={url}
        />
      )}
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params, req } = context;
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const slug = Array.isArray(params?.slug) ? params.slug : [];
  const siteConfig = await fetchSiteSettings(lang);
  const page = await fetchPage(lang, slug);

  const session = await getUserSession(context);

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
      isAuthenticated: !!session?.isAuthenticated,
    },
  };
};
