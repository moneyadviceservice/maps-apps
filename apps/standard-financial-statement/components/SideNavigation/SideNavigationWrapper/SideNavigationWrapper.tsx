import { useEffect } from 'react';

import { LinkType, SideNavigationItemGroup } from 'types/@adobe/components';

import { Navigation } from '../Navigation';
import { NestedNavigation } from '../NestedNavigation';

export const SideNavigationWrapper = ({
  language,
  isNavGroup = false,
  links,
  slug,
}: {
  language: string;
  isNavGroup?: boolean;
  links: LinkType[] | SideNavigationItemGroup[];
  slug: string[];
}) => {
  useEffect(() => {
    document.documentElement.lang = language;
  });

  return (
    <>
      {isNavGroup ? (
        <NestedNavigation
          language={language}
          sideNavigationGroups={links as SideNavigationItemGroup[]}
          slug={slug}
        />
      ) : (
        <Navigation
          language={language}
          links={links as LinkType[]}
          slug={slug}
        />
      )}
    </>
  );
};
