import { render, screen } from '@testing-library/react';

import { Footer } from '.';
import { footerLinksMock } from './footerMocks';

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
        footerLinkGroup={footerLinksMock}
        copyright={'Copyright 2026'}
        reservedRights={'All rights reserved'}
      />,
    );
    const footer = screen.getByTestId('mps-footer');
    expect(footer).toMatchSnapshot();
  });
});
