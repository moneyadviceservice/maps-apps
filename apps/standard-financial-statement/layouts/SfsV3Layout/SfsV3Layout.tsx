import { PropsWithChildren } from 'react';

import { SideNavigation } from 'components/SideNavigation';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { twMerge } from 'tailwind-merge';
import { LinkType } from 'types/@adobe/components';
import { SiteSettings } from 'types/@adobe/site-settings';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Container } from '@maps-react/core/components/Container';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  slug: string[];
  lang: string;
  breadcrumbs: LinkType[];
  isAuthenticated?: boolean;
} & PropsWithChildren;

const baseLinkProps = { description: null, className: 'text-xl font-bold' };

export const SfsV3Layout = ({
  lang,
  slug,
  breadcrumbs,
  siteConfig,
  assetPath,
  isAuthenticated,
  children,
}: Props) => {
  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={'Review Your SFS'}
      breadcrumbs={breadcrumbs}
      breadcrumbClassname={'hidden lg:block'}
      lang={lang}
      slug={['review-your-sfs']}
      isAuthenticated={isAuthenticated}
      categoryLevels={[]}
      pageType="SFS V3 Development Area"
      mainClassname="py-4 lg:pt-10 lg:pb-[5rem] bg-gray-100"
    >
      <Container className="max-w-[1272px]">
        <div className={twMerge(['flex flex-col lg:flex-row lg:gap-16'])}>
          <SideNavigation
            isNavGroup={true}
            slug={slug}
            language={lang}
            className="bg-transparent hidden lg:block"
            wrapperClassName="bg-white"
            links={[
              {
                title: null,
                childLinks: [
                  {
                    ...baseLinkProps,
                    linkTo: '/use-the-sfs',
                    text: 'Use the SFS',
                    className: 'text-sm font-normal underline',
                  },
                  {
                    ...baseLinkProps,
                    linkTo: '/v3/personal-details',
                    text: 'Personal details',
                  },
                  {
                    ...baseLinkProps,
                    linkTo: '/v3/monthly-income',
                    text: 'Monthly Income',
                  },
                  {
                    ...baseLinkProps,
                    linkTo: '/v3/outgoings-fixed',
                    text: 'Outgoings Fixed',
                  },
                  {
                    ...baseLinkProps,
                    linkTo: '/v3/outgoings-flexible',
                    text: 'Outgoings Flexible',
                  },
                  {
                    ...baseLinkProps,
                    linkTo: '/v3/savings-and-debt',
                    text: 'Savings and Debt',
                  },
                  {
                    ...baseLinkProps,
                    linkTo: '/v3/review-your-sfs',
                    text: 'Review',
                  },
                  {
                    ...baseLinkProps,
                    linkTo: '/v3/additional-notes',
                    text: 'Additional notes',
                    className: 'text-sm font-normal underline',
                  },
                ],
              },
            ]}
          />
          <div className="flex flex-col justify-start items-start lg:items-start">
            <div className="mb-4 [&_a]:text-sm [&_a]:font-semibold [&_a]:text-blue-600 [&_svg]:relative [&_svg]:top-[1px] lg:mb-8">
              <BackLink href={`/${lang}/v3`}>Back</BackLink>
            </div>
            {children}
          </div>
        </div>
      </Container>
    </BasePageLayout>
  );
};
