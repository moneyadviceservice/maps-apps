import { render, screen } from '@testing-library/react';

import { AdminFooter } from './AdminFooter';

import '@testing-library/jest-dom';

describe('AdminFooter', () => {
  it('renders copyright text with the current year', () => {
    render(<AdminFooter />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(`© ${year} Money and Pensions Service`),
    ).toBeInTheDocument();
  });

  it('has the admin-footer test id', () => {
    render(<AdminFooter />);
    expect(screen.getByTestId('admin-footer')).toBeInTheDocument();
  });
});
