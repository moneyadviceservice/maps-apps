import Image from 'next/image';

import { twMerge } from 'tailwind-merge';
import { AdminUser } from 'types/admin/base';
import { v4 as uuid } from 'uuid';

import { Icon, IconType, Link } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';

type Props = {
  assetPath: string;
  logoPath: string;
  user?: AdminUser;
};

export const AdminHeader = ({ assetPath, logoPath, user }: Props) => {
  const skipToContentFocusStyles =
    'focus:not-sr-only focus:bg-yellow-200 focus:z-20 focus:border-b-4 focus:border-b-blue-800 focus:absolute focus:p-2 focus:rounded focus:top-4 focus:left-4 focus:z-50';

  return (
    <header data-testid="admin-header">
      <a className={twMerge('sr-only', skipToContentFocusStyles)} href="#main">
        {'Skip to content'}
      </a>

      <div className="relative bg-blue-600 print:hidden">
        <Container className="flex items-center justify-center  max-w-[1272px]">
          <a
            href={`/admin`}
            aria-label={'SFS Admin'}
            className="max-h-[64px] max-w-[116px] lg:max-w-[186px] lg:max-h-[102px]"
          >
            {logoPath && (
              <Image
                src={`${assetPath}${logoPath}`}
                alt="SFS"
                height={0}
                width={186}
              />
            )}
          </a>
          {user && (
            <div className="items-center hidden ml-auto lg:flex">
              <AccountLinks user={user} />
            </div>
          )}
        </Container>
      </div>
    </header>
  );
};

type AccountLinksProps = {
  user: AdminUser;
};

const AccountLinks = ({ user }: AccountLinksProps) => {
  const accountLinks = [
    {
      linkTo: '/profile',
      item: (
        <div className="flex items-center gap-2">
          <Icon
            type={IconType.PROFILE}
            className="fill-white [&_g]:fill-white"
          />
          <div className="flex flex-col leading-tight">
            <div className="font-bold">{user.name}</div>
            <div>{user.email}</div>
          </div>
        </div>
      ),
      description: null,
      classes: 'no-underline, text-sm',
    },
    {
      linkTo: '/logout',
      item: 'Sign out',
      description: null,
    },
  ];

  return (
    <nav data-testid="admin-nav">
      <ul className="flex items-center space-x-4 ">
        {accountLinks?.map(({ item, linkTo, description, classes }) => {
          return (
            <li key={uuid()} className="flex items-center">
              <Link
                className={twMerge(
                  ['ml-2 flex items-center text-white '],
                  classes,
                )}
                href={`${linkTo}`}
                title={description ?? ''}
              >
                {item}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
