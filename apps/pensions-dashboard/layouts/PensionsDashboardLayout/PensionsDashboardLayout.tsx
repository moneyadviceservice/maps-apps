import Head from 'next/head';
import { twMerge } from 'tailwind-merge';
import { CommonLinks } from '../../components/CommonLinks';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SITE_TITLE } from '../../lib/constants';
import { Breadcrumb, Crumb } from '@maps-react/common/components/Breadcrumb';
import { Container } from '@maps-react/core/components/Container';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';

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
  const pageTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;
  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header />
      <Container className="mt-16">
        {breadcrumb && (
          <div className="ml-[-1rem]">
            <Breadcrumb crumbs={breadcrumb} />
          </div>
        )}
        {backLink && (
          <div className="flex items-center text-pink-600 group py-4">
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

      <main className="flex-grow mb-16">
        <Container className="text-base">{children}</Container>
      </main>

      {showCommonLinks && <CommonLinks />}

      <Footer />
    </div>
  );
};
