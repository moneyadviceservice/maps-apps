import { useRouter } from 'next/router';

import { twMerge } from 'tailwind-merge';

import { Icon, IconType, Link } from '@maps-react/common/index';

import { SideNavigationModel } from '../../types';
import {
  isItemActive,
  normalisePath,
  stripTrailingSlash,
} from '../../utils/navigation';

export interface SideNavigationProps {
  lang: string;
  navigation: SideNavigationModel | null;
  className?: string;
}

const NAV_SECTIONS: Record<string, string[]> = {
  '/learning-pathway-intro': ['/learning-pathway'],
};

export const SideNavigation = ({
  lang,
  navigation,
  className,
}: SideNavigationProps) => {
  const { asPath } = useRouter();

  if (!navigation) {
    return null;
  }

  const items = (navigation.links ?? []).filter(
    ({ title, link }) => title && link,
  );

  if (items.length === 0) {
    return null;
  }

  const currentPath = normalisePath(asPath);

  return (
    <nav
      aria-labelledby="side-navigation-title"
      data-testid="side-navigation"
      className={twMerge(
        'hidden md:block p-4 bg-white border border-gray-300 rounded-bl-3xl',
        className,
      )}
    >
      <h2
        id="side-navigation-title"
        className="mb-4 text-2xl font-bold text-gray-800"
      >
        {navigation.navigationTitle}
      </h2>
      <ul>
        {items.map(({ title, link }, index) => {
          const href = stripTrailingSlash(`/${lang}${link}`);
          const sections = NAV_SECTIONS[link] ?? [];
          const isCurrentPage = isItemActive(href, currentPath, sections, lang);

          return (
            <li
              key={href}
              className={twMerge(
                'flex items-center py-2',
                index < items.length - 1 && 'border-b border-gray-300',
              )}
            >
              {isCurrentPage ? (
                <span aria-current="page" className="text-lg text-gray-800">
                  {title}
                </span>
              ) : (
                <Link
                  href={href}
                  className="justify-between w-full text-lg no-underline hover:underline"
                >
                  <span>{title}</span>
                  <Icon
                    type={IconType.CHEVRON_RIGHT}
                    className="w-2 shrink-0"
                  />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
