import { render } from '@testing-library/react';

import { Navigation } from './Navigation';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

describe('Navigation component', () => {
  it('renders unnested nav correctly', () => {
    const { container } = render(
      <Navigation
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
});
