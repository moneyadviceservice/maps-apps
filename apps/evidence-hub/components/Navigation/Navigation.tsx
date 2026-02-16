import { twMerge } from 'tailwind-merge';
import { NavigationItem } from 'types/@adobe/components';

import { Icon, IconType, Link } from '@maps-react/common/index';

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

// Base styles for all navigation links
const baseLinkStyles = [
  'relative px-4 py-2 text-[18px] font-bold text-magenta-500 text-left',
  'transition-colors duration-300',
  '[&:visited:not(:hover)]:!text-magenta-500',
  'no-underline',
];

// Hover styles
const hoverStyles = ['hover:bg-magenta-500 hover:text-white'];
// focus styles
const focusStyles = [
  'focus:outline-none focus:bg-yellow-400 focus:text-blue-900',
  'focus:hover:bg-yellow-400 focus:hover:text-blue-900',
  '[&:focus]:bg-yellow-400 [&:focus]:text-blue-900',
  // Bottom border using pseudo-element
  'focus:after:content-[""] focus:after:absolute focus:after:bottom-0 focus:after:left-0 focus:after:right-0 focus:after:h-1 focus:after:bg-blue-700',
  'focus:hover:after:content-[""] focus:hover:after:absolute focus:hover:after:bottom-0 focus:hover:after:left-0 focus:hover:after:right-0 focus:hover:after:h-1 focus:hover:after:bg-blue-700',
  '[&:focus]:after:content-[""] [&:focus]:after:absolute [&:focus]:after:bottom-0 [&:focus]:after:left-0 [&:focus]:after:right-0 [&:focus]:after:h-1 [&:focus]:after:bg-blue-700',
];

// Helper function to get link classes
const getLinkClasses = (additionalClasses: string[] = []) => {
  // Focus override styles with !important to ensure they override any conflicting styles
  const focusOverrideStyles = [
    '[&:focus]:!bg-yellow-400 [&:focus]:!text-blue-900',
    '[&:focus:hover]:!bg-yellow-400 [&:focus:hover]:!text-blue-900',
    // Remove shadow focus styling from Link component default
    'focus:shadow-none',
    '[&:focus]:!shadow-none',
    // Bottom border using pseudo-element to prevent layout shift
    '[&:focus]:after:!content-[""] [&:focus]:after:!absolute [&:focus]:after:!bottom-0 [&:focus]:after:!left-0 [&:focus]:after:!right-0 [&:focus]:after:!h-1 [&:focus]:after:!bg-blue-700',
    '[&:focus:hover]:after:!content-[""] [&:focus:hover]:after:!absolute [&:focus:hover]:after:!bottom-0 [&:focus:hover]:after:!left-0 [&:focus:hover]:after:!right-0 [&:focus:hover]:after:!h-1 [&:focus:hover]:after:!bg-blue-700',
  ];

  return twMerge(
    ...baseLinkStyles,
    ...hoverStyles,
    // Use same focus styles for all links (consistent styling)
    ...focusStyles,
    // Focus override with !important to ensure it always takes precedence
    ...focusOverrideStyles,
    ...additionalClasses,
  );
};

export const Navigation = ({ items, className }: NavigationProps) => {
  return (
    <nav
      aria-label="Primary navigation"
      className={twMerge('mb-2.5', className)}
    >
      <ul className="flex items-center">
        {items.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0;
          const menuId = `menu-${item.text
            .toLowerCase()
            .replaceAll(/\s+/g, '-')}-${index}`;

          return (
            <li
              key={`nav-item-${index}`}
              className="nav-item relative"
              role="none"
            >
              {hasChildren ? (
                <div className="group relative">
                  <button
                    type="button"
                    role="menuitem"
                    aria-haspopup="true"
                    id={`nav-button-${index}`}
                    aria-controls={menuId}
                    className={twMerge([
                      ...baseLinkStyles,
                      ...hoverStyles,
                      ...focusStyles,
                      'group/button nav-button flex items-center whitespace-nowrap',
                    ])}
                  >
                    {item.text}
                    <Icon
                      type={IconType.CHEVRON_DOWN}
                      className={twMerge(
                        'nav-chevron ml-1 group-focus-within:rotate-180',
                        ['min-w-4'],
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  <ul
                    id={menuId}
                    className={twMerge(
                      'dropdown absolute left-0 top-full z-50 mt-1 min-w-[244px] max-w-[calc(100vw-2rem)]',
                      'rounded-lg bg-white p-2 shadow-[0_20px_30px_0_rgba(28,30,35,0.2),0_-7px_40px_0_rgba(28,30,35,0.2)]',
                      'opacity-0 invisible pointer-events-none translate-y-1',
                      'group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-[4px]',
                      'sm:before:content-[""] sm:before:absolute sm:before:z-[1] sm:before:left-[15px] sm:before:top-[4px] sm:before:-translate-y-full',
                      'sm:before:w-0 sm:before:h-0 sm:before:border-b-[16px] sm:before:border-b-white',
                      'sm:before:border-l-[16px] sm:before:border-l-transparent sm:before:border-r-[16px] sm:before:border-r-transparent',
                      'sm:group-focus-within/submenu:before:opacity-100',
                      'sm:group-focus-within/submenu:before:left-[2px]',
                      'sm:group-focus-within/submenu:before:!z-[1]',
                    )}
                    aria-label={`${item.text} submenu`}
                  >
                    {item.children?.map((child, childIndex) => {
                      const hasSubChildren =
                        child.children && child.children.length > 0;
                      const submenuId = `menu-${child.text
                        .toLowerCase()
                        .replaceAll(/\s+/g, '-')}-${childIndex}`;

                      return (
                        <li
                          key={`dropdown-item-${childIndex}`}
                          className="dropdown-item relative"
                          role="none"
                        >
                          {hasSubChildren ? (
                            <div className="group/submenu relative">
                              <button
                                type="button"
                                role="menuitem"
                                aria-haspopup="true"
                                aria-controls={submenuId}
                                className={twMerge([
                                  ...baseLinkStyles,
                                  ...hoverStyles,
                                  ...focusStyles,
                                  'group/button dropdown-button flex w-full items-center justify-between',
                                  'sm:before:content-[""] sm:before:absolute sm:before:z-[1] sm:before:right-[-8px] sm:before:top-1/2 sm:before:-translate-y-1/2',
                                  'sm:before:w-0 sm:before:h-0 sm:before:border-t-[16px] sm:before:right-[-8px] sm:before:border-b-[16px]',
                                  'sm:before:border-r-[16px] sm:before:border-t-transparent sm:before:border-b-transparent',
                                  'sm:before:border-r-white sm:before:opacity-0',
                                  'sm:group-focus-within/submenu:before:opacity-100',
                                  'sm:group-focus-within/submenu:before:right-[-24px]',
                                  'sm:group-focus-within/submenu:before:!z-[1]',
                                ])}
                              >
                                {child.text}
                                <Icon
                                  type={IconType.CHEVRON_DOWN}
                                  className={twMerge(
                                    'nav-chevron min-w-4 w-4 rotate-[-90deg] group-focus-within/submenu:rotate-90',
                                  )}
                                  aria-hidden="true"
                                />
                              </button>
                              <ul
                                id={submenuId}
                                className={twMerge(
                                  'submenu absolute z-1 min-w-[244px] max-w-[calc(100vw-2rem)]',
                                  'rounded-lg bg-white p-2 shadow-[0_20px_30px_0_rgba(28,30,35,0.2),0_-7px_40px_0_rgba(28,30,35,0.2)]',
                                  'z-2',
                                  'sm:left-full sm:top-0 left-0 top-full group-focus-within/submenu:ml-4',
                                  'opacity-0 invisible pointer-events-none translate-x-1',
                                  'group-focus-within/submenu:opacity-100 group-focus-within/submenu:visible group-focus-within/submenu:pointer-events-auto',
                                  'group-focus-within/submenu:translate-x-0 group-focus-within/submenu:translate-y-0',
                                )}
                                aria-label={`${child.text} submenu`}
                              >
                                {child.children?.map(
                                  (subChild, subChildIndex) => (
                                    <li
                                      key={`submenu-item-${subChildIndex}`}
                                      role="none"
                                    >
                                      <Link
                                        href={
                                          subChild.linkTo
                                            ? `${subChild.linkTo}`
                                            : '#'
                                        }
                                        role="menuitem"
                                        className={getLinkClasses(['block'])}
                                      >
                                        {subChild.text}
                                      </Link>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          ) : (
                            <Link
                              href={child.linkTo ? `${child.linkTo}` : '#'}
                              role="menuitem"
                              className={getLinkClasses(['block'])}
                            >
                              {child.text}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <Link
                  href={item.linkTo ? `${item.linkTo}` : '#'}
                  role="menuitem"
                  className={getLinkClasses([
                    'nav-button flex items-center whitespace-nowrap',
                  ])}
                >
                  {item.text}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
