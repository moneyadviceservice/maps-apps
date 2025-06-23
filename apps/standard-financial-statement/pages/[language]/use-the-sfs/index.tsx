import { GetServerSideProps } from 'next';

import { getIronSession, IronSessionData } from 'iron-session';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { UseTheSfsLayout } from 'layouts/UseTheSfsLayout';
import { sessionOptions } from 'lib/auth/sessionOptions';
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
  isAuthenticated?: boolean;
};

const Page = ({
  siteConfig,
  assetPath,
  page,
  lang,
  url,
  isAuthenticated,
}: Props) => {
  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={page.title}
      breadcrumbs={page.breadcrumbs}
      lang={lang}
      slug={[`/use-the-sfs`]}
      isAuthenticated={isAuthenticated}
    >
      {page && (
        <UseTheSfsLayout
          page={page}
          lang={lang}
          slug={[`/use-the-sfs`]}
          url={url}
          orgActive={true}
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
  res,
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

  const session = await getIronSession<IronSessionData>(
    req,
    res,
    sessionOptions,
  );

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
