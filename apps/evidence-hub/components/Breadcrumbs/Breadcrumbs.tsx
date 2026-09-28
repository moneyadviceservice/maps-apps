import { LinkType } from 'types/@adobe/components';

import { Breadcrumb } from '@maps-react/common/index';

type BreadcrumbsProps = {
  breadcrumbs: LinkType[];
  lang: string;
};

export const Breadcrumbs = ({ breadcrumbs, lang }: BreadcrumbsProps) => {
  if (!breadcrumbs?.length) {
    return null;
  }

  const crumbs = breadcrumbs.map((breadcrumb) => {
    const { text, linkTo } = breadcrumb;

    // Handle external links
    if (linkTo.includes('http')) {
      return {
        label: text,
        link: linkTo,
      };
    }

    // Handle root/empty links
    if (!linkTo || linkTo === '/') {
      return {
        label: text,
        link: `/${lang}`,
      };
    }

    // Remove leading slash and construct localized link
    const cleanLink = linkTo.replace(/^\//, '');

    return {
      label: text,
      link: `/${lang}/${cleanLink}`,
    };
  });

  return (
    <div className="-ml-2">
      <Breadcrumb crumbs={crumbs} />
    </div>
  );
};
