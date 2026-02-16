import { ReactNode } from 'react';

import Head from 'next/head';

import { Breadcrumbs } from 'components/Breadcrumbs';
import { TitleBanner } from 'components/TitleBanner';
import { LinkType } from 'types/@adobe/components';
import { SiteSettings } from 'types/@adobe/site-settings';

import { Analytics } from '@maps-react/core/components/Analytics';
import { Container } from '@maps-react/core/components/Container';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

export type BasePageLayoutProps = {
  pageTitle: string;
  bannerTitle?: string;
  siteConfig: SiteSettings;
  assetPath: string;
  categoryLevels: string[];
  pageType: string;
  breadcrumbs: LinkType[] | undefined;
  lang: string;
  children: ReactNode;
};

export const BasePageLayout = ({
  pageTitle,
  bannerTitle,
  siteConfig,
  assetPath,
  categoryLevels,
  pageType,
  breadcrumbs,
  lang,
  children,
}: BasePageLayoutProps) => {
  const { seoDescription, headerLogo, navigation, footerLinks } = siteConfig;

  const title = `${pageTitle} | Money and Pensions Service`;

  return (
    <Analytics
      trackDefaults={{
        toolCompletion: false,
        toolStartRestart: false,
        errorMessage: false,
        pageLoad: true,
        emptyToolCompletion: false,
      }}
      analyticsData={{
        page: {
          pageName: bannerTitle,
          pageTitle: title,
          pageType: pageType,
          categoryLevels: categoryLevels,
        },
      }}
      currentStep={0}
      formData={{}}
      lastStep={0}
      errors={[]}
    >
      <div id="top">
        <Head>
          <title>{title}</title>
          <meta name="description" content={seoDescription} />
        </Head>

        <Header
          assetPath={`${assetPath}`}
          logo={headerLogo}
          navigation={navigation}
        />

        <main id="main">
          {bannerTitle && <TitleBanner title={bannerTitle} />}

          <Container className="max-w-[1200px] pt-6">
            {breadcrumbs && breadcrumbs?.length > 0 && (
              <Breadcrumbs breadcrumbs={breadcrumbs} lang={lang} />
            )}
            {children}
          </Container>
        </main>

        <Footer footerLinks={footerLinks} />
      </div>
    </Analytics>
  );
};
