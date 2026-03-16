import { Fragment } from 'react';

import { SideNavigationItemGroup } from 'types/@adobe/components';
import { v4 as uuidv4 } from 'uuid';

import { Heading } from '@maps-react/common/components/Heading';

import { NavigationItem } from '../NavigationItem';

type NavigationGroupsProps = {
  language: string;
  sideNavigationGroups: SideNavigationItemGroup[];
  slug: string[];
};

export const NestedNavigation = ({
  language,
  sideNavigationGroups,
  slug,
}: NavigationGroupsProps) => {
  return (
    <nav className="bg-white min-w-[300px] lg:max-w-[300px] lg:sticky lg:top-4 lg:overflow-y-auto">
      <div className="lg:border-1 lg:border-slate-400 lg:border-r-r lg:rounded-bl-[24px] pb-4 lg:pb-0 mb-8">
        {sideNavigationGroups.map((item, index) => {
          const isLastGroup = index === sideNavigationGroups.length - 1;

          return (
            <Fragment key={uuidv4()}>
              {item?.title && (
                <Heading
                  level="h5"
                  className="pt-6 pb-3 mx-5 border-b-1 border-b-slate-400"
                >
                  {item?.title}
                </Heading>
              )}

              {item?.childLinks?.length > 0 && (
                <ul>
                  {item?.childLinks.map((link, itemIndex) => (
                    <NavigationItem
                      isGroup={true}
                      key={uuidv4()}
                      lang={language}
                      linkItem={link}
                      isLastLink={
                        isLastGroup && itemIndex === item?.childLinks.length - 1
                      }
                      isActive={
                        slug && slug[0] === (link as { linkTo: string }).linkTo
                      }
                    />
                  ))}
                </ul>
              )}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
};
