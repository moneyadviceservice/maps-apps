import { GetServerSideProps } from 'next';

import { ToggleFormProvider } from 'components/ToggleFormProvider';
import Cookies from 'cookies';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { getUserSession } from 'lib/auth/sessionManagement/getUserSession';
import { Entry } from 'lib/types';
import { PageError, PageTemplate } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchPage, fetchSiteSettings } from 'utils/fetch';
import { getUrl } from 'utils/getUrl';

import { getStoreEntry } from '../../../utils/store';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  page: {
    pageTemplate: PageTemplate;
  };
  lang: string;
  url: string;
  entry: Entry;
  step: boolean;
  isAuthenticated: boolean;
};

const Page = ({
  siteConfig,
  assetPath,
  page,
  lang,
  url,
  entry,
  step,
  isAuthenticated,
}: Props) => {
  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={page?.pageTemplate.title}
      breadcrumbs={page.pageTemplate.breadcrumbs}
      lang={lang}
      slug={[`/apply-to-use-the-sfs`]}
      isAuthenticated={isAuthenticated}
      pageType="Category"
    >
      <ToggleFormProvider
        entry={entry}
        assetPath={assetPath}
        page={page}
        lang={lang}
        url={url}
        step={step}
      />
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params, query, req, res } = context;
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const slug = Array.isArray(params?.slug) ? params.slug : [];
  const siteConfig = await fetchSiteSettings(lang);
  const page = await fetchPage(lang, ['apply-to-use-the-sfs']);

  const cookies = new Cookies(req, res);
  const sessionId = cookies.get('fsid');

  const { entry } = await getStoreEntry(sessionId as string);

  const referrer = req.headers.referer || req.headers.referrer;
  const isPageRefresh =
    referrer?.includes('apply-to-use-the-sfs') ?? referrer === undefined;
  if (!isPageRefresh) {
    entry.data = {};
    entry.errors = [];
  }

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
      entry: {
        data: entry.data ?? {},
        errors: entry.errors ?? [],
      }, // don't expose continuation token to frontend
      step: !!query['user'] && entry?.errors?.length === 0,
      isAuthenticated: !!session?.isAuthenticated,
    },
  };
};
