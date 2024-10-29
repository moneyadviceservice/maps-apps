import Link from 'next/link';

export type Crumb = {
  label: string;
  link: string;
};

const BreadcrumbMobile = ({ crumbs }: BreadcrumbProps) => {
  const crumbsLength = crumbs.length;
  const classes =
    'print:hidden md:hidden outline-none t-breadcrumb-mobile pl-2.5 flex items-center py-1 relative z-1 border-1 border-white shadow-box-link hover:border-1 hover:border-pink-800 focus:bg-yellow-200 focus:shadow-box-link-focus focus:border-2 focus:border-purple-700 focus:border-opacity-100';

  return (
    <Link
      href={crumbs[crumbsLength - 1].link}
      data-testid="breadcrumb-mobile"
      className={classes}
    >
      <svg
        aria-hidden="true"
        width="8"
        height="14"
        viewBox="0 0 8 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 14L8 12L4.1 8.1C3.5 7.5 3.5 6.6 4.1 6L8 2L6 -8.74228e-08L1.8 4.2C0.200001 5.8 0.200001 8.3 1.8 9.9L6 14Z"
          fill="#C82A87"
        />
      </svg>
      <div className="pl-2">
        {crumbsLength > 1 && (
          <p className="text-base">{crumbs[crumbsLength - 2].label}</p>
        )}
        <p className="hover:text-pink-900 focus:text-gray-800 text-base font-semibold text-pink-600">
          {crumbs[crumbsLength - 1].label}
        </p>
      </div>
    </Link>
  );
};

const BreadcrumbDesktop = ({ crumbs }: BreadcrumbProps) => {
  const classes =
    'text-pink-600 text-sm font-bold hover:underline hover:text-pink-900 focus:bg-yellow-200 focus:shadow-link-focus outline-none';
  return (
    <nav
      data-testid="breadcrumb-desktop"
      aria-label="breadcrumbs"
      className="md:block hidden"
    >
      <ul className="t-breadcrumb-desktop flex px-4 py-4">
        {crumbs.map((v, i) => {
          return (
            <li key={i} className="flex items-center pr-2">
              <Link href={v.link} className={classes}>
                {v.label}
              </Link>
              {i < crumbs.length - 1 && (
                <div className="pl-2" aria-hidden="true">
                  <svg
                    width="8"
                    height="15"
                    viewBox="0 0 8 15"
                    fill="#c82a87"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 0.5L8.74228e-08 2.5L3.9 6.4C4.5 7 4.5 7.9 3.9 8.5L5.24537e-07 12.5L2 14.5L6.2 10.3C7.8 8.7 7.8 6.2 6.2 4.6L2 0.5Z"
                      fill="#C82A87"
                    />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export type BreadcrumbProps = {
  crumbs: Crumb[];
};

export const Breadcrumb = ({ crumbs }: BreadcrumbProps) => {
  if (!crumbs || crumbs.length < 1) {
    return null;
  }

  return (
    <>
      <BreadcrumbMobile crumbs={crumbs} />
      <BreadcrumbDesktop crumbs={crumbs} />
    </>
  );
};
