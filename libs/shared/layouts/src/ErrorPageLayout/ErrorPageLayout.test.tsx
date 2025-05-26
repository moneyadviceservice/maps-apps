import React from 'react';

import { render } from '@testing-library/react';

import { ErrorPageLayout } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

window.gtag = jest.fn();
window.CookieControl = {
  load: jest.fn(),
  open: jest.fn(),
};

describe('ErrorPage component', () => {
  it('renders correctly', () => {
    const { container } = render(<ErrorPageLayout isEmbedded={false} />);
    expect(container).toMatchSnapshot();
  });

  it('renders embedded correctly', () => {
    const { container } = render(<ErrorPageLayout isEmbedded={true} />);
    expect(container).toMatchSnapshot();
  });
});
