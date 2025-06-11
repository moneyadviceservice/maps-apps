import { GetServerSideProps } from 'next';

import { ToggleFormProvider } from 'components/ToggleFormProvider';
import Cookies from 'cookies';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { Entry } from 'lib/types';
import { PageError, PageTemplate } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchPage, fetchSiteSettings } from 'utils/fetch';
import { getUrl } from 'utils/getUrl';

import { getStoreEntry } from '../../../utils/store';
import { sessionOptions } from 'lib/auth/sessionOptions';
import { getIronSession, IronSessionData } from 'iron-session';
import { isUserAuthenticated } from 'utils/auth/isUserAuthenticated';

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

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
  req,
  res,
}) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const slug = Array.isArray(params?.slug) ? params.slug : [];
  const siteConfig = await fetchSiteSettings(lang);
  const page = await fetchPage(lang, ['apply-to-use-the-sfs']);

  const cookies = new Cookies(req, res);
  const sessionId = cookies.get('fsid');
  const { entry } = await getStoreEntry(sessionId as string);

  const session = await getIronSession<IronSessionData>(
    req,
    res,
    sessionOptions,
  );
  const isAuthenticated = session && isUserAuthenticated(session);

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
      entry: entry.data
        ? entry
        : {
            data: {},
            errors: [],
          },
      step: !!query['user'] && entry?.errors?.length === 0,
      isAuthenticated: isAuthenticated,
    },
  };
};
