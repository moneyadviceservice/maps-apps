import { ReactNode } from 'react';

import Head from 'next/head';

import { LinkType } from 'types/@adobe/components';
import { SiteSettings } from 'types/@adobe/site-settings';

import { BreadcrumbWrapper } from '../../components/BreadcrumbWrapper';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

export type BasePageLayoutProps = {
  pageTitle: string;
  siteConfig: SiteSettings;
  assetPath: string;
  breadcrumbs: LinkType[] | undefined;
  slug: string[];
  lang: string;
  children: ReactNode;
};

export const BasePageLayout = ({
  pageTitle,
  siteConfig,
  assetPath,
  breadcrumbs,
  slug,
  lang,
  children,
}: BasePageLayoutProps) => {
  const {
    seoTitle,
    seoDescription,
    headerLogo,
    headerLogoMobile,
    accountLinks,
    headerLinks,
    mainNavigation,
    footerLogo,
    footerLinks,
  } = siteConfig;

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
        logoPathMobile={headerLogoMobile?.image._path}
        accountLinks={accountLinks}
        headerLinks={headerLinks}
        mainNavigation={mainNavigation}
      />

      {breadcrumbs && breadcrumbs?.length > 0 && (
        <BreadcrumbWrapper
          breadcrumbs={breadcrumbs}
          lang={lang}
          title={pageTitle}
          slug={slug}
        />
      )}

      {children}
      <Footer
        assetPath={`${assetPath}`}
        footerPath={footerLogo?.image._path}
        footerLogo={footerLogo}
        footerLinks={footerLinks}
      />
    </div>
  );
};
