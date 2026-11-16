import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { UseTheSfsLayout } from 'layouts/UseTheSfsLayout';
import { getUserSession } from 'lib/auth/sessionManagement';
import { getOrganisationStatus } from 'lib/organisations/getOrganisationStatus';
import { PageError, UseTheSfsPageTemplate } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
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
  assetBlob?: AssetBlob[];
  orgActive?: boolean;
  isAuthenticated?: boolean;
  requiresAuth?: boolean;
};

const Page = ({
  siteConfig,
  assetPath,
  page,
  lang,
  slug,
  url,
  assetBlob,
  isAuthenticated,
  orgActive,
  requiresAuth,
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
      categoryLevels={['Use the SFS', page.title]}
      pageType="Sub Category"
    >
      {page && (
        <UseTheSfsLayout
          page={page}
          lang={lang}
          slug={[`/use-the-sfs/${slug}`]}
          url={url}
          requiresAuth={requiresAuth}
          auth={isAuthenticated}
          orgActive={orgActive}
          assetBlob={assetBlob}
        />
      )}
    </BasePageLayout>
  );
};

export default Page;

const slugsNotRequiringAuth = new Set(['sfs-customer-version']);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params, query } = context;
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';
  const slug = Array.isArray(params?.slug) ? params.slug : [];
  const siteConfig = await fetchSiteSettings(lang);
  const page = await fetchUseTheSfs(lang, [`${slug[0]}`]);
  let assetBlob = await getBlob(slug[0], lang);

  if ((page as PageError).error) {
    return {
      notFound: true,
    };
  }

  const session = await getUserSession(context);

  const orgActive =
    session?.isAdmin || (await getOrganisationStatus(session?.username));
  const isAuthenticated = !!session?.isAuthenticated;

  const requiresAuth =
    slug.length === 0 || !slugsNotRequiringAuth.has(slug.join('/'));

  if (requiresAuth && !(isAuthenticated && orgActive)) {
    if (page) {
      page.introText = null;
      page.content = [];
    }
    assetBlob = [];
  }

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang: lang,
      slug: slug ?? [''],
      page: page,
      url: getUrl(req),
      requiresAuth,
      auth: query['auth'] === 'true',
      assetBlob: assetBlob,
      orgActive: orgActive,
      isAuthenticated: isAuthenticated,
    },
  };
};
