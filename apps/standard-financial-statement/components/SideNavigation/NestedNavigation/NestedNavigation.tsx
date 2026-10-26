import { Fragment } from 'react';

import { SideNavigationItemGroup } from 'types/@adobe/components';
import { v4 as uuidv4 } from 'uuid';

import { Heading } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';

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
  const { z } = useTranslation();

  return (
    <nav
      aria-label={z({
        en: 'Standard Financial Statement section navigation',
        cy: 'Llywio adrannau’r Datganiad Ariannol Safonol',
      })}
      className="bg-white lg:min-w-[300px] lg:max-w-[300px] lg:sticky lg:top-4 lg:overflow-y-auto"
    >
      <div className="border-1 border-slate-400 border-r-r rounded-bl-[24px] mb-8 overflow-hidden">
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
