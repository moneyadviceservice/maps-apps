import { render, screen } from '@testing-library/react';

import { AdminHeader } from './AdminHeader';

import '@testing-library/jest-dom';

jest.mock('lib/auth/routes', () => ({
  ADMIN_SIGN_OUT_URL: '/api/auth/signout?redirectTo=%2Fadmin',
}));

describe('AdminHeader', () => {
  it('renders the title link to the dashboard', () => {
    render(<AdminHeader />);
    const link = screen.getByText('Travel Insurance Directory');
    expect(link.closest('a')).toHaveAttribute('href', '/admin/dashboard');
  });

  it('renders the sign-out link by default', () => {
    render(<AdminHeader />);
    const signOut = screen.getByText('Sign out');
    expect(signOut.closest('a')).toHaveAttribute(
      'href',
      '/api/auth/signout?redirectTo=%2Fadmin',
    );
  });

  it('hides sign-out link when showSignOut is false', () => {
    render(<AdminHeader showSignOut={false} />);
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('renders signed-in user with name and email', () => {
    render(<AdminHeader userName="Jane Admin" userEmail="jane@example.com" />);
    expect(screen.getByTestId('admin-user-info')).toHaveTextContent(
      'Signed in as Jane Admin (jane@example.com)',
    );
    expect(screen.getByTestId('admin-user-name')).toHaveTextContent(
      'Jane Admin',
    );
    expect(screen.getByTestId('admin-user-email')).toHaveTextContent(
      '(jane@example.com)',
    );
  });

  it('renders name without email when email is not provided', () => {
    render(<AdminHeader userName="Jane Admin" />);
    expect(screen.getByTestId('admin-user-name')).toHaveTextContent(
      'Jane Admin',
    );
    expect(screen.queryByTestId('admin-user-email')).not.toBeInTheDocument();
  });

  it('does not render user info when name is not provided', () => {
    render(<AdminHeader />);
    expect(screen.queryByTestId('admin-user-info')).not.toBeInTheDocument();
  });
});
