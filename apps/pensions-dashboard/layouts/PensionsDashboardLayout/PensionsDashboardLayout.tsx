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
  isOffset?: boolean;
  toTopLink?: boolean;
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
  isOffset = true,
  toTopLink = true,
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
    <div id="top" className="flex flex-col h-screen">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header
        isLoggedInPage={isLoggedInPage}
        isLogoutModalOpen={isLogoutModalOpen}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
        showLanguageSwitchers={false}
      />
      <PhaseBanner phase={PhaseType.BETA} link={t('site.feedback-link')} />
      <Container
        className={twMerge(
          'flex-grow',
          isOffset && 'lg:px-0 lg:grid lg:grid-cols-12 lg:gap-x-4',
          !helpAndSupport && !toTopLink && 'mb-6 md:mb-20',
        )}
      >
        {hasTopLinks && (
          <div
            className={twMerge(
              isOffset && 'lg:col-span-12 lg:col-start-2 lg:pr-4',
              'mt-4 md:mt-6',
            )}
          >
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
          </div>
        )}

        <div
          className={twMerge(
            isOffset && 'lg:col-span-10 lg:col-start-2',
            'mt-6 md:mt-10',
            hasTopLinks && 'mt-9',
          )}
        >
          {title && (
            <Heading
              level="h1"
              data-testid="page-title"
              className={twMerge('mb-6 md:mb-8 text-blue-800 md:max-w-4xl')}
            >
              {title}
            </Heading>
          )}
          <main id="main">
            <div className="text-base">{children}</div>
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
        </div>
      </Container>

      {helpAndSupport && (
        <div
          id="help-and-support"
          data-testid="help-and-support"
          className="py-6 mt-6 md:py-14 md:mt-20 bg-grey_stripe"
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

      {toTopLink && (
        <Container data-testid="back-to-top" className="my-6">
          <Link className="text-base" href="#top">
            {t('site.back-to-top')}
            <Icon type={IconType.ARROW_UP} className="mt-[2px]" />
          </Link>
        </Container>
      )}
      <Footer />
    </div>
  );
};
