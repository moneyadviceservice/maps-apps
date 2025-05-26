import {
  fetchSiteMap,
  SiteMapData,
  SiteMapMetaData,
} from 'utils/fetch/sitemap';
import { BackToTop } from 'components/BackToTop';
import { RichTextWrapper } from 'components/RichTextWrapper';
import { SideNavigation } from 'components/SideNavigation';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { GetServerSideProps } from 'next';
import { twMerge } from 'tailwind-merge';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchSiteSettings } from 'utils/fetch';
import { getUrl } from 'utils/getUrl';

import { H1, H5, Link } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  lang: string;
  url: string;
  sitemap: {
    siteMap: SiteMapData;
    siteMapMeta: SiteMapMetaData;
  };
};

const Page = ({ siteConfig, assetPath, lang, sitemap, url }: Props) => {
  const { z } = useTranslation();
  const title = z({
    en: 'Sitemap',
    cy: 'Map safle',
  });
  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={[
        {
          text: title,
          description: '',
          linkTo: '/sitemap',
        },
      ]}
      slug={['/sitemap']}
      lang={lang}
      pageTitle={title}
    >
      <Container className="max-w-[1272px]">
        <div
          className={twMerge([
            'mt-8 lg:mt-16 flex flex-col lg:flex-row lg:gap-16',
          ])}
        >
          <SideNavigation
            slug={['/sitemap']}
            language={lang}
            links={sitemap.siteMap?.sideNavigationLinks}
          />
          <div className="pb-16 basis-2/3">
            <H1 className="mb-4">{title}</H1>
            <RichTextWrapper>
              <Link className="mb-8 text-lg font-bold" href={`/${lang}`}>
                {z({
                  en: 'Home',
                  cy: 'Hafan',
                })}
              </Link>
              {sitemap.siteMap?.linkGroup.map((g) => {
                return (
                  <div key={g.rootLink.text}>
                    <Link
                      className="mb-8 text-lg font-bold"
                      href={`/${lang}${g.rootLink.linkTo}`}
                    >
                      {g.rootLink.text}
                    </Link>
                    {g.childLinks?.length > 0 ? (
                      <ul className="ml-4 list-disc">
                        {g.childLinks.map((l) => (
                          <li key={l.text}>
                            <Link href={`/${lang}${l.linkTo}`}>{l.text}</Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {g.childLinksGroup.length > 0
                      ? g.childLinksGroup.map((l) => (
                          <div key={l.title} className="ml-4">
                            <H5 className="mb-4 text-xl">{l.title}</H5>
                            <ul className="ml-4 list-disc">
                              {l.childLinks.map((a) => (
                                <li key={a.text}>
                                  <Link href={`/${lang}${a.linkTo}`}>
                                    {a.text}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))
                      : null}
                  </div>
                );
              })}
            </RichTextWrapper>
            <BackToTop url={url} />
          </div>
        </div>
      </Container>
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const siteConfig = await fetchSiteSettings(lang);

  const sitemap = await fetchSiteMap(lang);

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang,
      sitemap,
      url: getUrl(req),
    },
  };
};
