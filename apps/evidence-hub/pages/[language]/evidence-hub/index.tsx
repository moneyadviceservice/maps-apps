import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { DocumentTemplate } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchDocuments, fetchSiteSettings } from 'utils/fetch';

import { Link } from '@maps-react/common/index';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  documents: DocumentTemplate[];
  lang: string;
};

const Page = ({ siteConfig, assetPath, lang, documents }: Props) => {
  return (
    <BasePageLayout
      pageTitle=""
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={[]}
      slug={['/']}
      lang={lang}
    >
      {documents
        .filter((doc) => doc.pageType)
        .map((doc) => (
          <div key={doc.title}>
            <Link
              href={{
                pathname: `/${lang}/evidence-hub/${doc.pageType?.key}/${doc.slug}`,
              }}
            >
              {doc.title}
            </Link>
          </div>
        ))}
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const siteConfig = await fetchSiteSettings(lang);
  const documents = await fetchDocuments(lang);

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang,
      documents: documents ?? [],
    },
  };
};
