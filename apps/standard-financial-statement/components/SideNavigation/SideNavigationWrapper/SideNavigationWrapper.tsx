import { LinkType, SideNavigationItemGroup } from 'types/@adobe/components';

import { Navigation } from '../Navigation';
import { NestedNavigation } from '../NestedNavigation';
import { SideNavigationContainer } from '../SideNavigationContainer';

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
  return (
    <SideNavigationContainer language={language}>
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
    </SideNavigationContainer>
  );
};
