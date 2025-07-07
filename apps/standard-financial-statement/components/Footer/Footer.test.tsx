import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { Footer } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('Footer component', () => {
  it('renders correctly', () => {
    render(
      <Footer
        assetPath=""
        footerPath={''}
        footerLogo={{
          image: {
            _path: '',
            width: 0,
            height: 0,
            mimeType: '',
          },
          altText: '',
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
