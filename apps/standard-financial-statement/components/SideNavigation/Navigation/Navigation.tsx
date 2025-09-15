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
    <nav className="bg-white min-w-[300px] lg:max-w-[300px] lg:sticky lg:top-4 lg:overflow-y-auto">
      <ul className="lg:border-1 lg:border-slate-400 lg:border-r-r lg:rounded-bl-[24px] pb-4 lg:pb-0">
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
