import { render } from '@testing-library/react';

import { NestedNavigation } from './NestedNavigation';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

export const sideNavigationGroups = [
  {
    title: null,
    childLinks: [
      {
        text: 'Use the SFS',
        linkTo: '/use-the-sfs',
        description: null,
      },
    ],
  },
  {
    title: 'Spending Guidelines',
    childLinks: [
      {
        text: 'Spending Guidelines 2024/25',
        linkTo: '/use-the-sfs/spending-guidelines',
        description: null,
      },
      {
        text: 'Commentary for 2024/25',
        linkTo: '/use-the-sfs/commentary-for',
        description: null,
      },
    ],
  },
];

describe('NestedNavigation component', () => {
  it('renders nested nav correctly', () => {
    const { container } = render(
      <NestedNavigation
        language="en"
        sideNavigationGroups={sideNavigationGroups}
        slug={['/use-the-nested-sfs']}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
