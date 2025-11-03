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
    render(<Footer footerLinks={[]} />);
    const footer = screen.getByTestId('footer');
    expect(footer).toMatchSnapshot();
  });
});
