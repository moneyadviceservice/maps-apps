import Head from 'next/head';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { CommonLinks } from '../../components/CommonLinks';
import { Header } from '../../components/Header';
import { Footer } from '@maps-react/core/components/Footer';
import { Breadcrumb, Crumb } from '@maps-react/common/components/Breadcrumb';
import { Container } from '@maps-react/core/components/Container';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import {
  PhaseBanner,
  PhaseType,
} from '@maps-react/core/components/PhaseBanner';

export type PensionsDashboardLayoutProps = {
  title?: string;
  breadcrumb?: Crumb[];
  backLink?: string;
  showCommonLinks?: boolean;
  children: React.ReactNode;
};

export const PensionsDashboardLayout = ({
  title,
  breadcrumb,
  backLink,
  showCommonLinks = false,
  children,
}: PensionsDashboardLayoutProps) => {
  const { t, locale } = useTranslation();
  const pageTitle = title ? `${title} | ${t('site.title')}` : t('site.title');

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header />
      <PhaseBanner phase={PhaseType.BETA} link={t('site.beta-banner-link')} />
      <Container className="mt-16">
        {breadcrumb && (
          <div className="ml-[-1rem]">
            <Breadcrumb crumbs={breadcrumb} />
          </div>
        )}
        {backLink && (
          <div className="flex items-center py-4 text-pink-600 group">
            <Icon
              className="text-pink-600 group-hover:text-pink-800 w-[8px] h-[15px]"
              type={IconType.CHEVRON_LEFT}
            />
            <Link
              href={backLink}
              className="ml-2 underline tool-nav-prev group-hover:text-pink-800 group-hover:no-underline"
            >
              Back
            </Link>
          </div>
        )}
        {title && (
          <Heading
            level="h1"
            className={twMerge(
              'mb-6 text-blue-800',
              (breadcrumb || backLink) && 'mt-8',
            )}
          >
            {title}
          </Heading>
        )}
      </Container>

      <main id="main" className="flex-grow mb-16">
        <Container className="text-base">{children}</Container>
      </main>

      {showCommonLinks && (
        <CommonLinks
          title={t('site.footer.common-links.heading')}
          links={[
            {
              title: t('site.footer.common-links.manage-consent'),
              href: `/${locale}/manage-consent`,
            },
            {
              title: t('site.footer.common-links.delegate-access'),
              href: `/${locale}/manage-consent`,
            },
            {
              title: t('site.footer.common-links.complaints'),
              href: `/${locale}/complaints`,
            },
            {
              title: t('site.footer.common-links.download-data'),
              href: `/${locale}/download-data`,
              icon: IconType.DOWNLOAD,
            },
          ]}
        />
      )}

      <Footer />
    </div>
  );
};
