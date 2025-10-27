import { render } from '@testing-library/react';

import { sideNavigationGroups } from '../NestedNavigation/NestedNavigation.test';
import { SideNavigationWrapper } from './SideNavigationWrapper';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

describe('SideNavigationWrapper component', () => {
  it('renders wrapper component with unnested children correctly', () => {
    const { container } = render(
      <SideNavigationWrapper
        language="en"
        links={[
          {
            linkTo: '/what-is-the-sfs',
            text: 'What is the Standard Financial Statement?',
            description: null,
          },
          {
            linkTo: '/what-is-the-sfs/find-free-debt-advice',
            text: 'Find debt advice',
            description: null,
          },
        ]}
        slug={['/what-is-the-sfs']}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders wrapper component with nested children correctly', () => {
    const { container } = render(
      <SideNavigationWrapper
        language="cy"
        links={sideNavigationGroups}
        slug={['/use-the-wrapper-sfs']}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
