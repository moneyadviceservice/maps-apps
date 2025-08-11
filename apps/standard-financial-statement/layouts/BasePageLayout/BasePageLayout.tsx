import { ReactNode } from 'react';

import Head from 'next/head';

import { AnalyticsWrapper } from 'components/Analytics';
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
  isAuthenticated?: boolean;
  categoryLevels?: string[];
  pageType?: string;
  children: ReactNode;
};

export const BasePageLayout = ({
  pageTitle,
  siteConfig,
  assetPath,
  breadcrumbs,
  slug,
  lang,
  isAuthenticated,
  pageType,
  categoryLevels,
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
    <AnalyticsWrapper
      analyticsData={{
        page: {
          pageName: pageTitle,
          pageTitle: title,
          pageType: pageType ?? 'Standard Financial Statement',
          categoryLevels: categoryLevels ?? [pageTitle],
        },
      }}
    >
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
          isAuthenticated={isAuthenticated}
        />

        {breadcrumbs && breadcrumbs?.length > 0 && (
          <BreadcrumbWrapper
            breadcrumbs={breadcrumbs}
            lang={lang}
            title={pageTitle}
            slug={slug}
          />
        )}
        <main id="main">{children}</main>
        <Footer
          assetPath={`${assetPath}`}
          footerPath={footerLogo?.image._path}
          footerLogo={footerLogo}
          footerLinks={footerLinks}
        />
      </div>
    </AnalyticsWrapper>
  );
};
