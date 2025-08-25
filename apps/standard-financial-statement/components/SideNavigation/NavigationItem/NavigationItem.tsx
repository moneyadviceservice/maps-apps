import { twMerge } from 'tailwind-merge';
import { LinkType } from 'types/@adobe/components';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/index';

const classNames = [
  'text-sm',
  'text-magenta-700',
  'visited:text-magenta-700',
  'px-4',
  'lg:px-6',
  'py-3',
  'flex',
  'items-center',
  'relative',
  'after:content-[""]',
  'after:absolute',
  'after:bottom-[-1px]',
  'after:left-4',
  'after:right-4',
  'lg:after:left-6',
  'lg:after:right-6',
  'after:h-[1px]',
  'after:bg-slate-400',
  'no-underline',
  'hover:underline',
  'hover:bg-gray-300',
  'focus:bg-yellow-200',
  'relative',
  'focus:shadow-transparent',
  'z-1',
];
const activeClasses = [
  'bg-green-300',
  'font-bold',
  'after:content-none',
  'hover:bg-green-300',
  'hover:no-underline',
];
const lastLinkClasses = ['lg:rounded-bl-[23px]', 'after:content-none'];

type NavigationLinkItemProps = {
  lang: string;
  linkItem: LinkType;
  isLastLink: boolean;
  isActive: boolean;
  isGroup?: boolean;
};

export const NavigationItem = ({
  lang,
  linkItem,
  isLastLink,
  isActive,
  isGroup,
}: NavigationLinkItemProps) => {
  const Component = isGroup ? Link : 'a';
  return (
    <li key={linkItem.linkTo}>
      <Component
        className={twMerge(
          classNames,
          isLastLink && lastLinkClasses,
          isActive && activeClasses,
        )}
        href={`/${lang}${linkItem.linkTo}`}
      >
        <span className="max-w-[90%]">{linkItem.text}</span>
        <Icon className="ml-auto" type={IconType.CHEVRON}></Icon>
      </Component>
    </li>
  );
};
