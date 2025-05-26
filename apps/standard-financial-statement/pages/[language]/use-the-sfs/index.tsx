import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { UseTheSfsLayout } from 'layouts/UseTheSfsLayout';
import { PageError, UseTheSfsPageTemplate } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchSiteSettings, fetchUseTheSfs } from 'utils/fetch';
import { getUrl } from 'utils/getUrl';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  page: UseTheSfsPageTemplate;
  lang: string;
  url: string;
};

const Page = ({ siteConfig, assetPath, page, lang, url }: Props) => {
  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={page.title}
      breadcrumbs={page.breadcrumbs}
      lang={lang}
      slug={[`/use-the-sfs`]}
    >
      {page && (
        <UseTheSfsLayout
          page={page}
          lang={lang}
          slug={[`/use-the-sfs`]}
          url={url}
          auth={true}
        />
      )}
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
  const page = await fetchUseTheSfs(lang, ['use-the-sfs']);

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
