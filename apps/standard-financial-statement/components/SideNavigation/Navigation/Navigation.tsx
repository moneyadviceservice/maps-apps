import { LinkType } from 'types/@adobe/components';
import { v4 as uuidv4 } from 'uuid';

import { NavigationItem } from '../NavigationItem';

type Props = {
  language: string;
  links: LinkType[];
  slug: string[];
};

export const Navigation = ({ language, links, slug }: Props) => {
  return (
    <nav
      aria-label="Standard Financial Statement"
      className="bg-white lg:min-w-[300px] mb-6 lg:max-w-[300px] lg:sticky lg:top-4 lg:overflow-y-auto lg:mb-0"
    >
      <ul className="border-1 border-slate-400 border-r-r rounded-bl-[24px] overflow-hidden">
        {links?.map((item, index) => {
          return (
            <NavigationItem
              key={uuidv4()}
              lang={language}
              linkItem={item}
              isLastLink={index === links.length - 1}
              isActive={slug && slug[0] === item.linkTo}
            />
          );
        })}
      </ul>
    </nav>
  );
};
