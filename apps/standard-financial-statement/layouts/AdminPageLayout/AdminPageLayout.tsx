import { ReactNode } from 'react';

import Head from 'next/head';

import { AdminSettings } from 'types/@adobe/site-settings';
import { AdminUser } from 'types/admin/base';

import { Breadcrumb, Crumb } from '@maps-react/common/components/Breadcrumb';
import { Container } from '@maps-react/core/components/Container';

import { AdminHeader } from '../../components/admin/AdminHeader';

export type AdminPageLayoutProps = {
  pageTitle: string;
  siteConfig: AdminSettings;
  assetPath: string;
  user?: AdminUser;
  crumbs?: Crumb[];
  isAuthenticated?: boolean;
  children: ReactNode;
};

export const AdminPageLayout = ({
  pageTitle,
  siteConfig,
  assetPath,
  user,
  crumbs,
  isAuthenticated,
  children,
}: AdminPageLayoutProps) => {
  const { seoTitle, seoDescription, headerLogo } = siteConfig;

  const title = pageTitle ? `${pageTitle} | ${seoTitle}` : seoTitle;

  const containerWidth = '1272px';

  return (
    <div id="top">
      <Head>
        <title>{title}</title>
        <meta name="description" content={seoDescription} />
      </Head>

      <AdminHeader
        assetPath={`${assetPath}`}
        logoPath={headerLogo?.image._path}
        user={user}
        isAuthenticated={isAuthenticated}
      />

      {crumbs && (
        <Container
          className={`md:m-auto md:px-4 max-w-[${containerWidth}]`}
          data-testid="breadcrumb-wrapper"
        >
          <Breadcrumb
            classes={[
              '[&_a]:font-normal [&_a]:underline [&_a]:text-magenta-800 [&_p]:text-magenta-800 [&_ul]:px-0 [&_ul]:py-3.5 [&_path]:fill-magenta-800 [&_svg]:rotate-180',
            ]}
            crumbs={crumbs}
          />
        </Container>
      )}

      <Container className={`pb-8 max-w-[${containerWidth}] bg-right mt-8`}>
        {children}
      </Container>
    </div>
  );
};
