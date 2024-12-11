import { useState } from 'react';

import Head from 'next/head';

import { twMerge } from 'tailwind-merge';

import { Breadcrumb, Crumb } from '@maps-react/common/components/Breadcrumb';
import { H2, Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { Container } from '@maps-react/core/components/Container';
import { Footer } from '@maps-react/core/components/Footer';
import {
  PhaseBanner,
  PhaseType,
} from '@maps-react/core/components/PhaseBanner';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Header } from '../../components/Header';
import { Timeout } from '../../components/Timeout';
import image1 from '../../public/images/hs-card-1.jpg';
import image2 from '../../public/images/hs-card-2.jpg';
import image3 from '../../public/images/hs-card-3.jpg';

export type PensionsDashboardLayoutProps = {
  seoTitle?: string;
  title?: string;
  breadcrumb?: Crumb[];
  back?: string;
  backText?: string;
  helpAndSupport?: boolean;
  enableTimeOut?: boolean;
  isLoggedInPage?: boolean;
  children: React.ReactNode;
};

export const PensionsDashboardLayout = ({
  seoTitle,
  title,
  breadcrumb,
  back,
  backText,
  helpAndSupport = false,
  enableTimeOut = true,
  isLoggedInPage = true,
  children,
}: PensionsDashboardLayoutProps) => {
  const { t, locale } = useTranslation();
  const pageTitle =
    seoTitle ?? title
      ? `${seoTitle ?? title} | ${t('site.title')}`
      : t('site.title');

  const hasTopLinks = helpAndSupport || back || breadcrumb;
  const timeoutDuration =
    1000 * Number(process.env.NEXT_PUBLIC_MHPD_TIMEOUT_SECONDS);
  const modalTimeoutDuration =
    1000 * Number(process.env.NEXT_PUBLIC_MHPD_MODAL_TIMEOUT_SECONDS);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header
        isLoggedInPage={isLoggedInPage}
        isLogoutModalOpen={isLogoutModalOpen}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
      />
      <PhaseBanner phase={PhaseType.BETA} link={t('site.feedback-link')} />
      <Container className={twMerge(hasTopLinks ? 'mt-6' : 'mt-16')}>
        {breadcrumb && (
          <div className="ml-[-1rem]">
            <Breadcrumb crumbs={breadcrumb} />
          </div>
        )}

        {(helpAndSupport || back) && (
          <div
            className={`flex text-base ${
              back ? 'justify-between' : 'justify-end'
            }`}
          >
            {back && (
              <Link href={back} data-testid="back" color="text-blue-500">
                <Icon type={IconType.CHEVRON_LEFT} />{' '}
                {backText ?? t('site.back')}
              </Link>
            )}
            {helpAndSupport && (
              <Link
                href="#help-and-support"
                data-testid="help-and-support-link"
                color="text-blue-500"
              >
                {t('site.help-and-support-link-text')}
                <Icon
                  type={IconType.ARROW_UP}
                  className="rotate-[180deg] mt-[1px]"
                />
              </Link>
            )}
          </div>
        )}

        {title && (
          <Heading
            level="h1"
            data-testid="page-title"
            className={twMerge(
              'mb-6 text-blue-800 md:max-w-4xl',
              hasTopLinks && 'mt-8',
            )}
          >
            {title}
          </Heading>
        )}
      </Container>

      <main id="main" className="flex-grow mb-16">
        <Container className="text-base">{children}</Container>
        {enableTimeOut && (
          <>
            <Timeout
              duration={timeoutDuration}
              modalDuration={modalTimeoutDuration}
              setIsLogoutModalOpen={setIsLogoutModalOpen}
            />
            <noscript data-testid="noscript-refresh">
              <meta
                httpEquiv="refresh"
                content={`${
                  timeoutDuration / 1000
                };url=/${locale}/you-have-been-inactive-for-a-while`}
              />
            </noscript>
          </>
        )}
      </main>

      {helpAndSupport && (
        <div
          id="help-and-support"
          data-testid="help-and-support"
          className="py-6 -mb-8 md:py-16 border-b-1 border-y-slate-400 bg-grey_stripe"
        >
          <Container className="text-base">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <H2
                  color="text-blue-800"
                  className="mb-2 md:mb-6 md:mt-6 lg:text-5xl"
                >
                  {t('site.help-and-support.title')}
                </H2>
                <Paragraph className="mb-2 md:mb-4">
                  <Link href={t('site.feedback-link')}>
                    {t('site.help-and-support.feedback-link')}
                  </Link>
                </Paragraph>
              </div>
              <TeaserCard
                title={t('site.help-and-support.card-1.title')}
                image={image1}
                description={t('site.help-and-support.card-1.description')}
                href={`/${locale}/support/explore-the-pensions-dashboard`}
                imageClassName="h-[204px]"
                headingLevel="h4"
              />
              <TeaserCard
                title={t('site.help-and-support.card-2.title')}
                image={image2}
                description={t('site.help-and-support.card-2.description')}
                href={`/${locale}/support/understand-your-pensions`}
                imageClassName="h-[204px]"
                headingLevel="h4"
              />
              <TeaserCard
                title={t('site.help-and-support.card-3.title')}
                image={image3}
                description={t('site.help-and-support.card-3.description')}
                href={`/${locale}/support/report-a-technical-problem`}
                imageClassName="h-[204px]"
                headingLevel="h4"
              />
            </div>
          </Container>
        </div>
      )}
      <Footer />
    </div>
  );
};
