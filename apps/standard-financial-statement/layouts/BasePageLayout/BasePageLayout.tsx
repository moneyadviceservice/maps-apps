import { ReactNode, useState } from 'react';

import Head from 'next/head';

import { AnalyticsWrapper } from 'components/Analytics';
import { BreadcrumbWrapper } from 'components/BreadcrumbWrapper';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { config } from 'data/civic-cookies';
import { LinkType } from 'types/@adobe/components';
import { SiteSettings } from 'types/@adobe/site-settings';
import { transformImageToStaticImageData } from 'utils/transformImageToStaticImageData';

import { CookieConsent } from '@maps-react/vendor/components/CookieConsent/CookieConsent';

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

  const [isCookieConsentOpen, setIsCookieConsentOpen] = useState(true);

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
        <div aria-hidden={isCookieConsentOpen}>
          <Header
            headerLogo={transformImageToStaticImageData(
              headerLogo,
              assetPath,
              186,
              102,
            )}
            headerLogoMobile={transformImageToStaticImageData(
              headerLogoMobile,
              assetPath,
              146,
              64,
            )}
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
            footerLogo={transformImageToStaticImageData(
              footerLogo,
              assetPath,
              167,
              53,
            )}
            footerLinks={footerLinks}
          />
        </div>
        <CookieConsent isOpen={setIsCookieConsentOpen} config={config} />
      </div>
    </AnalyticsWrapper>
  );
};
