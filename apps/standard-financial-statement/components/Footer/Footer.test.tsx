import { render, screen } from '@testing-library/react';

import { Footer } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('Footer component', () => {
  it('renders correctly', () => {
    render(
      <Footer
        footerLogo={{
          src: '/footer-logo',
          width: 167,
          height: 53,
          altText: 'sfs logo',
        }}
        footerLinks={[
          {
            linkTo: '/accessibility',
            text: 'Accessibility',
            description: null,
          },
          { linkTo: '/cookies', text: 'Cookies', description: null },
          { linkTo: '/privacy', text: 'Privacy', description: null },
          { linkTo: '/sitemap', text: 'Sitemap', description: null },
        ]}
      />,
    );
    const footer = screen.getByTestId('footer');
    expect(footer).toMatchSnapshot();
  });
});
