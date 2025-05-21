import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { PageLayout } from 'layouts/PageLayout/PageLayout';
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
};

const Page = ({ siteConfig, assetPath, page, lang, slug, url }: Props) => {
  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={page.pageTemplate.title}
      breadcrumbs={page.pageTemplate.breadcrumbs}
      lang={lang}
      slug={[`/apply-to-use-the-sfs/${slug}`]}
    >
      <PageLayout
        assetPath={assetPath}
        page={page.pageTemplate}
        lang={lang}
        slug={[`/apply-to-use-the-sfs/${slug}`]}
        url={url}
      />
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const slug = Array.isArray(params?.slug) ? params.slug : [];
  const siteConfig = await fetchSiteSettings(lang);
  const page = await fetchPage(lang, [`apply-to-use-the-sfs>${slug[0]}`]);

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
    },
  };
};
