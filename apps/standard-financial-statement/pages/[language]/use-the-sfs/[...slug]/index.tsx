import { GetServerSideProps } from 'next';

import { getIronSession, IronSessionData } from 'iron-session';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { UseTheSfsLayout } from 'layouts/UseTheSfsLayout';
import { sessionOptions } from 'lib/auth/sessionOptions';
import { PageError, UseTheSfsPageTemplate } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import { isUserAuthenticated } from 'utils/auth/isUserAuthenticated';
import { fetchSiteSettings, fetchUseTheSfs } from 'utils/fetch';
import { AssetBlob, getBlob } from 'utils/getBlob/getBlob';
import { getUrl } from 'utils/getUrl';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  page: UseTheSfsPageTemplate;
  slug: string[];
  lang: string;
  url: string;
  auth: boolean;
  assetBlob?: AssetBlob[];
  isAuthenticated?: boolean;
};

const Page = ({
  siteConfig,
  assetPath,
  page,
  lang,
  slug,
  url,
  auth,
  assetBlob,
  isAuthenticated,
}: Props) => {
  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={page.title}
      breadcrumbs={page.breadcrumbs}
      lang={lang}
      slug={[`/use-the-sfs/${slug}`]}
      isAuthenticated={isAuthenticated}
    >
      {page && (
        <UseTheSfsLayout
          page={page}
          lang={lang}
          slug={[`/use-the-sfs/${slug}`]}
          url={url}
          auth={isAuthenticated}
          assetBlob={assetBlob}
        />
      )}
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
  query,
}) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const slug = Array.isArray(params?.slug) ? params.slug : [];
  const siteConfig = await fetchSiteSettings(lang);
  const page = await fetchUseTheSfs(lang, [`use-the-sfs>${slug[0]}`]);

  const assetBlob = await getBlob(slug[0], lang);

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
  const isAuthenticated = session && isUserAuthenticated(session);

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang: lang,
      slug: slug ?? [''],
      page: page,
      url: getUrl(req),
      auth: query['auth'] === 'true',
      assetBlob: assetBlob,
      isAuthenticated: isAuthenticated,
    },
  };
};
