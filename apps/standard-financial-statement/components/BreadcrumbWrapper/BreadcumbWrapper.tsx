import { LinkType } from 'types/@adobe/components';

import { Breadcrumb, Crumb } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';

export const BreadcrumbWrapper = ({
  lang,
  breadcrumbs,
  title,
  slug,
}: {
  lang: string;
  breadcrumbs?: LinkType[];
  title: string;
  slug: string[];
}) => {
  const { z } = useTranslation();
  const crumbs = getBreadcumbs(lang, title, slug, z, breadcrumbs);

  if (!crumbs.length) return null;

  return (
    <div className="px-0 bg-gray-150" data-testid="breadcrumb-wrapper">
      <Container className="m-0 p-0 md:m-auto md:px-4 max-w-[1272px]">
        <Breadcrumb
          classes={[
            '[&_a]:text-blue-600 [&_p]:text-blue-600 [&_ul]:px-0 [&_ul]:py-3.5 [&_path]:fill-blue-600',
          ]}
          crumbs={crumbs}
        />
      </Container>
    </div>
  );
};

const getBreadcumbs = (
  lang: string,
  title: string,
  slug: string[],
  t: ReturnType<typeof useTranslation>['z'],
  links: LinkType[] = [],
): Crumb[] => {
  if (!links?.length) {
    return [];
  }

  const breadcrumbs: Crumb[] = [
    {
      link: `/${lang}`,
      label: t({ en: 'Home', cy: 'Cartref' }),
    },
    ...links.map((link) => {
      return {
        link: `/${lang}${link.linkTo}`,
        label: slug?.includes(link.linkTo) ? title : link.text,
      };
    }),
  ];

  return breadcrumbs;
};
