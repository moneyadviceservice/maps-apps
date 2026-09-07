import { Logo, NavigationItem } from '../../types';

export const headerLogoMock: Logo = {
  image: {
    _path: '/content/dam/sfs/assets/logos/sfs-logo.png',
    width: 186,
    height: 101,
    mimeType: 'image/png',
  },
  altText: 'Money and Pensions Service',
};

export const headerNavigationMock: NavigationItem[] = [
  {
    text: 'Money',
    linkTo: '/money',
    children: [
      {
        text: 'Budgeting',
        linkTo: '/money/budgeting',
        children: [
          {
            text: 'Budget planner',
            linkTo: '/money/budgeting/planner',
          },
        ],
      },
      {
        text: 'Saving',
        linkTo: '/money/saving',
      },
    ],
  },
  {
    text: 'Pensions',
    linkTo: '/pensions',
    children: [
      {
        text: 'State Pension',
        linkTo: '/pensions/state-pension',
      },
    ],
  },
  {
    text: 'Benefits',
    linkTo: '/benefits',
  },
];
