import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { twMerge } from 'tailwind-merge';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchSiteSettings } from 'utils/fetch';

import { H2, Heading, Link, Paragraph } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const lang = Array.isArray(query?.language)
    ? query?.language[0]
    : query?.language ?? 'en';

  const siteConfig = await fetchSiteSettings(lang);

  return {
    props: {
      lang: lang,
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
    },
  };
};

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  lang: string;
};

const Page = ({ siteConfig, assetPath, lang }: Props) => {
  const { z } = useTranslation();

  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={[]}
      lang={lang}
      slug={['/']}
      pageTitle={z({
        en: 'Error',
        cy: 'Gwall',
      })}
    >
      <Container className="pb-16 max-w-[1272px]">
        <div className={twMerge('lg:max-w-[840px] space-y-8 pt-8 lg:pt-16')}>
          <Heading>
            {z({
              en: 'Sorry, we couldn’t find the page you’re looking for',
              cy: 'Mae’n ddrwg gennym, nid oeddem yn gallu ddod o hyd i’r dudalen rydych yn chwilio amdani',
            })}
          </Heading>
          <Paragraph>
            {z({
              en: 'It may no longer exist, or the link contained an error.',
              cy: 'Efallai nad yw’n bodoli mwyach, neu roedd y ddolen yn cynnwys gwall.',
            })}
          </Paragraph>
          <H2>
            {z({
              en: 'What you can do',
              cy: 'Yr hyn y gallwch ei wneud',
            })}
          </H2>
          <ul className="pl-8 space-y-2 list-disc">
            <li>
              {z({
                en: 'Look for the page via the',
                cy: 'Chwiliwch am y dudalen drwy’r',
              })}{' '}
              <Link
                href={`/${lang}`}
                className="text-magenta-800 text-[18px] font-bold"
              >
                {z({
                  en: 'homepage',
                  cy: 'Hafan',
                })}
              </Link>
            </li>
            <li>
              {z({
                en: 'Visit our',
                cy: 'Ewch i',
              })}{' '}
              <Link
                href={`/${lang}/sitemap`}
                className="text-magenta-800 text-[18px] font-bold"
              >
                {z({
                  en: 'sitemap',
                  cy: 'fap ein gwefan',
                })}
              </Link>
            </li>
            <li>
              {z({
                en: 'Use the search form in the header of the website',
                cy: 'Defnyddiwch y ffurflen chwilio ar bennawd y wefan',
              })}
            </li>
          </ul>
        </div>
      </Container>
    </BasePageLayout>
  );
};

export default Page;
