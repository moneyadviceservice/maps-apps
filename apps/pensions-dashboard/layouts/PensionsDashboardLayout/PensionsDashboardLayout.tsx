import Head from 'next/head';

import { twMerge } from 'tailwind-merge';

import { Breadcrumb, Crumb } from '@maps-react/common/components/Breadcrumb';
import { H2, Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link, linkClasses } from '@maps-react/common/components/Link';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { Container } from '@maps-react/core/components/Container';
import { Footer } from '@maps-react/core/components/Footer';
import {
  PhaseBanner,
  PhaseType,
} from '@maps-react/core/components/PhaseBanner';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Header } from '../../components/Header';
import { useLogoutHandler } from '../../components/Logout';
import { PensionDownload } from '../../components/PensionDownload';
import { Tabs } from '../../components/Tabs';
import { Timeout } from '../../components/Timeout';
import { MODAL_TIMEOUT_SECONDS, TIMEOUT_SECONDS } from '../../lib/constants';
import { focusHashTarget } from '../../lib/utils/ui';
import image1 from '../../public/images/hs-card-1.jpg';
import image2 from '../../public/images/hs-card-2.jpg';
import image3 from '../../public/images/hs-card-3.jpg';

export type PensionsDashboardLayoutProps = {
  seoTitle?: string;
  title?: string;
  breadcrumb?: Crumb[];
  back?: string;
  backText?: string;
  homeLink?: boolean;
  helpAndSupport?: boolean;
  showDownloadLink?: boolean;
  enableTimeOut?: boolean;
  isLoggedInPage?: boolean;
  isOffset?: boolean;
  toTopLink?: boolean;
  showTabsNavigation?: boolean; // this enables the tabs navigation above the footer
  showToolFeedBack?: boolean; // this enables the tool feedback component above the footer
  children: React.ReactNode;
};

export const PensionsDashboardLayout = ({
  seoTitle,
  title,
  breadcrumb,
  back,
  backText,
  homeLink,
  helpAndSupport = false,
  showDownloadLink = false,
  enableTimeOut = true,
  isLoggedInPage = true,
  isOffset = true,
  toTopLink = true,
  showTabsNavigation,
  showToolFeedBack = true,
  children,
}: PensionsDashboardLayoutProps) => {
  const { t, locale } = useTranslation();
  const pageTitle =
    seoTitle ?? title
      ? `${seoTitle ?? title} - ${t('site.title')}`
      : t('site.title');

  const hasTopLinks =
    helpAndSupport || back || breadcrumb || homeLink || showDownloadLink;

  // Calculate timeout values in milliseconds
  const timeoutDuration = TIMEOUT_SECONDS * 1000;
  const modalTimeoutDuration = MODAL_TIMEOUT_SECONDS * 1000;

  const { isLogoutModalOpen, setIsLogoutModalOpen, handleLogout } =
    useLogoutHandler();

  focusHashTarget();

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header
        isLoggedInPage={isLoggedInPage}
        isLogoutModalOpen={isLogoutModalOpen}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
        handleLogout={handleLogout}
        showLanguageSwitchers={true}
      />
      <PhaseBanner phase={PhaseType.BETA} text={t('site.feedback')} />
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

            {(helpAndSupport || back || homeLink) && (
              <div
                className={`flex text-base ${
                  back || homeLink ? 'justify-between' : 'justify-end'
                }`}
              >
                {(homeLink || back) && (
                  <nav
                    data-testid="dashboard-nav"
                    aria-label={t('site.dashboard-nav')}
                  >
                    <ul className="block p-0 m-0 list-none">
                      {homeLink && (
                        <li className="inline-block mr-2 md:mr-3">
                          <Link
                            href={`/${locale}/your-pension-search-results`}
                            data-testid="home-link"
                            color="text-blue-500"
                          >
                            {t('site.home')}
                          </Link>
                        </li>
                      )}

                      {back && (
                        <li className="inline-block">
                          <Link
                            href={back}
                            data-testid="back"
                            color="text-blue-500"
                          >
                            <Icon type={IconType.CHEVRON_LEFT} />{' '}
                            {backText ?? t('site.back')}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </nav>
                )}

                {helpAndSupport && (
                  <Link
                    href="#help-and-support"
                    data-testid="help-and-support-link"
                    color="text-blue-500"
                    className="text-right"
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

            {showDownloadLink && <PensionDownload />}
          </div>
        )}

        <div
          className={twMerge(
            isOffset && 'lg:col-span-10 lg:col-start-2',
            'mt-6 md:mt-10',
            hasTopLinks && 'mt-9',
          )}
        >
          <main id="main">
            {title && (
              <Heading
                level="h1"
                data-testid="page-title"
                className="mb-6 text-blue-700 break-words md:mb-8 md:max-w-4xl"
                id="top"
                tabIndex={-1}
              >
                {title}
              </Heading>
            )}
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
                    content={`${TIMEOUT_SECONDS};url=/${locale}/you-have-been-inactive-for-a-while`}
                  />
                </noscript>
              </>
            )}
          </main>
        </div>
      </Container>

      {helpAndSupport && (
        <div
          data-testid="help-and-support"
          className="py-6 mt-6 md:py-14 md:mt-20 bg-slate-200"
        >
          <Container className="text-base">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <H2
                  color="text-blue-700"
                  className="mb-2 md:mb-6 md:mt-6 lg:text-5xl"
                  id="help-and-support"
                  tabIndex={-1}
                >
                  {t('site.help-and-support.title')}
                </H2>
                <Link href={`/${locale}/contact-us-form`}>
                  {t('site.help-and-support.contact-us')}
                </Link>
              </div>
              <TeaserCard
                title={t('site.help-and-support.card-1.title')}
                image={image1}
                description={t('site.help-and-support.card-1.description')}
                href={`/${locale}/support/explore-the-pensions-dashboard`}
                imageClassName="h-[204px]"
                headingLevel="h4"
                headingComponent="h3"
              />
              <TeaserCard
                title={t('site.help-and-support.card-2.title')}
                image={image2}
                description={t('site.help-and-support.card-2.description')}
                href={`/${locale}/support/understand-your-pensions`}
                imageClassName="h-[204px]"
                headingLevel="h4"
                headingComponent="h3"
              />
              <TeaserCard
                title={t('site.help-and-support.card-3.title')}
                image={image3}
                description={t('site.help-and-support.card-3.description')}
                href={`/${locale}/support/report-a-technical-problem`}
                imageClassName="h-[204px]"
                headingLevel="h4"
                headingComponent="h3"
              />
            </div>
          </Container>
        </div>
      )}

      {toTopLink && (
        <Container data-testid="back-to-top" className="my-6">
          <a className={twMerge('text-base', ...linkClasses)} href="#top">
            {t('site.back-to-top')}
            <Icon type={IconType.ARROW_UP} className="mt-[2px]" />
          </a>
        </Container>
      )}

      {showToolFeedBack && (
        <div
          data-testid="tool-feedback"
          className="mt-6 border-t border-gray-100 lg:mt-2"
        >
          <div className="container-auto">
            <ToolFeedback
              className="mt-0 lg:w-9/12 xl:w-7/12 2xl:w-1/2"
              overrideIzCr={true}
              surveyIds={{
                production: {
                  en: 'informizely-embed-rzyuzifh',
                  cy: 'informizely-embed-rfjiyuhqd',
                },
                development: {
                  en: 'informizely-embed-rfduylicd',
                  cy: 'informizely-embed-rfiiujdfjh',
                },
              }}
            />
          </div>
        </div>
      )}

      {showTabsNavigation && (
        <Container>
          <Tabs testId="bottom-tabs" className="!mb-5 !mt-0 md:hidden" />
        </Container>
      )}
      <Footer
        altPrivacyLink={`/${locale}/dashboard-privacy-notice`}
        altContactUs={`/${locale}/contact-us-form`}
      />
    </div>
  );
};
