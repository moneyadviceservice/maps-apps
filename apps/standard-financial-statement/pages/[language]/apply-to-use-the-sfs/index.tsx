import { GetServerSideProps } from 'next';

import { ToggleFormProvider } from 'components/ToggleFormProvider';
import Cookies from 'cookies';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { Entry } from 'lib/types';
import { PageError, PageTemplate } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchPage, fetchSiteSettings } from 'utils/fetch';
import { getUrl } from 'utils/getUrl';

import {
  Button,
  Callout,
  CalloutVariant,
  Paragraph,
} from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

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
};

const Page = ({
  siteConfig,
  assetPath,
  page,
  lang,
  url,
  entry,
  step,
}: Props) => {
  const { z } = useTranslation();

  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={page?.pageTemplate.title}
      breadcrumbs={page.pageTemplate.breadcrumbs}
      lang={lang}
      slug={[`/apply-to-use-the-sfs`]}
    >
      <ToggleFormProvider
        entry={entry}
        assetPath={assetPath}
        page={page}
        lang={lang}
        url={url}
        step={step}
      >
        <Callout
          variant={CalloutVariant.INFORMATION_BLUE}
          className="pb-10 mt-10 mb-8 lg:px-10"
        >
          <Paragraph>
            {z({
              en: 'Please check your organisation does not already have a current SFS Licence',
              cy: 'Gwiriwch nad oes gan eich sefydliad Drwydded SFS gyfredol eisoes',
            })}
          </Paragraph>
          <Button
            as="a"
            href={`${lang}/what-is-the-sfs/public-organisations`}
            className="bg-green-300 text-blue-600"
          >
            {z({
              en: 'Check here',
              cy: 'Gwiriwch yma',
            })}
          </Button>
        </Callout>
      </ToggleFormProvider>
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
    },
  };
};
