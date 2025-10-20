import { ReactNode } from 'react';

import Head from 'next/head';

import { Breadcrumbs } from 'components/Breadcrumbs';
import { TitleBanner } from 'components/TitleBanner';
import { LinkType } from 'types/@adobe/components';
import { SiteSettings } from 'types/@adobe/site-settings';

import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

export type BasePageLayoutProps = {
  pageTitle: string;
  siteConfig: SiteSettings;
  assetPath: string;
  breadcrumbs: LinkType[] | undefined;
  lang: string;
  children: ReactNode;
};

export const BasePageLayout = ({
  pageTitle,
  siteConfig,
  assetPath,
  breadcrumbs,
  lang,
  children,
}: BasePageLayoutProps) => {
  const { z } = useTranslation();
  const { seoTitle, seoDescription, headerLogo, mainNavigation, footerLinks } =
    siteConfig;

  const title = pageTitle ? `${pageTitle} | ${seoTitle}` : seoTitle;

  return (
    <div id="top">
      <Head>
        <title>{title}</title>
        <meta name="description" content={seoDescription} />
      </Head>

      <Header
        assetPath={`${assetPath}`}
        logoPath={headerLogo?.image._path}
        mainNavigation={mainNavigation}
      />

      <TitleBanner
        title={z({ en: 'Evidence library', cy: 'Evidence library' })}
      />

      <Container className="max-w-[1272px] pt-6">
        {breadcrumbs && breadcrumbs?.length > 0 && (
          <Breadcrumbs breadcrumbs={breadcrumbs} lang={lang} />
        )}
        <main id="main">{children}</main>
      </Container>

      <Footer footerLinks={footerLinks} />
    </div>
  );
};
