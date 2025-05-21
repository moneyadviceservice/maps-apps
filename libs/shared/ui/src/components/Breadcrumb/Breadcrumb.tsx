import Link from 'next/link';

import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '../Icon';

export type Crumb = {
  label: string;
  link: string;
};

const BreadcrumbMobile = ({ crumbs }: CrumbProps) => {
  const crumbsLength = crumbs.length;
  const classes =
    'print:hidden md:hidden outline-none t-breadcrumb-mobile pl-2.5 flex items-center py-1 relative z-1 border-1 border-white shadow-box-link hover:border-1 hover:border-pink-800 focus:bg-yellow-200 focus:shadow-box-link-focus focus:border-2 focus:border-purple-700 focus:border-opacity-100';

  return (
    <Link
      href={
        crumbsLength > 1
          ? crumbs[crumbsLength - 2].link
          : crumbs[crumbsLength - 1].link
      }
      data-testid="breadcrumb-mobile"
      className={classes}
    >
      <Icon className="w-4" type={IconType.CHEVRON_LEFT} />
      <div className="pl-2">
        {crumbsLength > 1 && (
          <p className="text-base">{crumbs[crumbsLength - 2].label}</p>
        )}
        <p className="text-base font-semibold text-pink-600 hover:text-pink-900 focus:text-gray-800">
          {crumbs[crumbsLength - 1].label}
        </p>
      </div>
    </Link>
  );
};

const BreadcrumbDesktop = ({ crumbs }: CrumbProps) => {
  const defaultClasses =
    'text-pink-600 text-sm font-bold hover:underline hover:text-pink-900 focus:bg-yellow-200 focus:shadow-link-focus outline-none';
  return (
    <nav
      data-testid="breadcrumb-desktop"
      aria-label="breadcrumbs"
      className="hidden md:block"
    >
      <ul className="flex px-4 py-4 t-breadcrumb-desktop">
        {crumbs.map((v, i) => {
          return (
            <li key={i} className="flex items-center pr-2">
              <Link href={v.link} className={defaultClasses}>
                {v.label}
              </Link>
              {i < crumbs.length - 1 && (
                <Icon className="w-4 pl-2" type={IconType.CHEVRON_RIGHT} />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export type CrumbProps = {
  crumbs: Crumb[];
};

export interface BreadcrumbProps extends CrumbProps {
  classes?: string[];
}

export const Breadcrumb = ({ crumbs, classes }: BreadcrumbProps) => {
  if (!crumbs || crumbs.length < 1) {
    return null;
  }

  return (
    <div className={twMerge(['[&_path]:fill-pink-600'], classes)}>
      <BreadcrumbMobile crumbs={crumbs} />
      <BreadcrumbDesktop crumbs={crumbs} />
    </div>
  );
};
