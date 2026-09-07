import { ReactNode } from 'react';

import Head from 'next/head';

import { TitleBanner } from 'components/TitleBanner';
import { SiteConfigType } from 'lib/types/site.type';

import { H2 } from '@maps-react/common/index';
import { Analytics } from '@maps-react/core/components/Analytics';
import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { Footer } from '@maps-react/mps/components/Footer';
import { Header } from '@maps-react/mps/components/Header';
import { SideNavigation } from '@maps-react/mps/components/SideNavigation';
import { StickyNav } from '@maps-react/mps/components/StickyNav';
import { SideNavigationModel } from '@maps-react/mps/types';

type AnalyticsToolDataProp = {
  stepName?: string;
  toolCategory?: string;
  toolName?: string;
  toolStep?: string | number;
};

type BaseLayoutProps = {
  bannerTitle: string;
  siteConfig: SiteConfigType;
  seoDescription: string;
  seoTitle: string;
  assetPath: string;
  children: ReactNode;
  language?: string;
  sideNavigation?: SideNavigationModel | null;
  toolCompletion?: boolean;
  toolStartRestart?: boolean;
  toolData?: AnalyticsToolDataProp;
  currentStep?: number;
  lastStep?: number;
  title?: string;
  pageType?: string;
  categoryLevels?: string[];
};

const STICKY_NAV_SECTIONS: Record<string, string[]> = {
  '/learning-pathway-intro': ['/learning-pathway'],
};

export const BaseLayout = ({
  title,
  bannerTitle,
  seoDescription,
  seoTitle,
  siteConfig,
  assetPath,
  language = 'en',
  sideNavigation,
  pageType = 'Content page',
  categoryLevels,
  toolCompletion = false,
  toolStartRestart = false,
  currentStep,
  toolData,
  lastStep,
  children,
}: BaseLayoutProps) => {
  const { t } = useTranslation();
  const { headerLogo, navigation = [], footerLinks = [] } = siteConfig;
  const copyrightSection =
    t('footer.copyright') +
    ' ' +
    new Date().getFullYear() +
    ' ' +
    'Money & Pensions Service, Borough Hall, Cauldwell Street, Bedford, MK42 9AB.';
  return (
    <BasePageLayout>
      <Analytics
        trackDefaults={{
          toolCompletion: toolCompletion,
          toolStartRestart: toolStartRestart,
          errorMessage: false,
          pageLoad: true,
          emptyToolCompletion: toolCompletion,
        }}
        analyticsData={{
          page: {
            pageName: bannerTitle ?? seoTitle,
            pageTitle: seoTitle,
            site: 'maps',
            pageType,
            categoryLevels,
          },
          tool: toolData,
        }}
        currentStep={currentStep ?? 0}
        formData={{}}
        lastStep={lastStep ?? 0}
      >
        <Head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
        </Head>
        <Header
          assetPath={assetPath}
          logo={headerLogo}
          navigation={navigation}
        />
        <TitleBanner title={bannerTitle} />
        <Container className="max-w-[1200px]">
          {title && (
            <H2 className="pt-10 text-blue-700" data-testid="page-title">
              {title}
            </H2>
          )}
          <main id="main" className="mb-20" data-sticky-nav-start>
            {children}

            {sideNavigation && (
              <noscript>
                <style>{`[data-testid="sticky-nav"]{display:none;}`}</style>
                <SideNavigation
                  lang={language}
                  navigation={sideNavigation}
                  className="block md:hidden"
                />
              </noscript>
            )}
          </main>
        </Container>
        <Footer
          footerLinkGroup={footerLinks}
          copyright={copyrightSection}
          reservedRights={t('footer.rightsReserved')}
        />
        {sideNavigation && (
          <StickyNav
            lang={language}
            navigation={sideNavigation}
            navSections={STICKY_NAV_SECTIONS}
            label={t('sticky-nav.exploreTopic')}
            closeLabel={t('sticky-nav.close')}
          />
        )}
      </Analytics>
    </BasePageLayout>
  );
};
