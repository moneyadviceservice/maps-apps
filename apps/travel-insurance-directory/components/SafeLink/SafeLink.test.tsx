import type { ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';

import { SafeLink } from './SafeLink';

jest.mock('@maps-react/common/components/Link', () => ({
  Link: ({ children, href, ...props }: ComponentProps<'a'>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('SafeLink Component', () => {
  const mockHiddenRoutes = ['/admin', '/register', '/api/auth'];

  it('renders null if the href is exactly in the hiddenRoutes list', () => {
    const { container } = render(
      <SafeLink href="/admin" hiddenRoutes={mockHiddenRoutes}>
        Admin Panel
      </SafeLink>,
    );

    expect(container.firstChild).toBeNull();
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('renders null if the href starts with a hidden route (wildcard check)', () => {
    const { container } = render(
      <SafeLink href="/register/setup/profile" hiddenRoutes={mockHiddenRoutes}>
        Finish Registration
      </SafeLink>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders the fallbackHref as a standard anchor when the primary route is hidden', () => {
    const fallback = 'https://external-site.com/auth';
    render(
      <SafeLink
        href="/register"
        hiddenRoutes={['/register']}
        fallbackHref={fallback}
      >
        Register
      </SafeLink>,
    );

    const link = screen.getByRole('link', { name: /register/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', fallback);
  });

  it('renders the link and text if the route is NOT hidden', () => {
    render(
      <SafeLink
        href="/dashboard"
        hiddenRoutes={mockHiddenRoutes}
        withTextBefore="Go to"
        withTextAfter="now"
      >
        Dashboard
      </SafeLink>,
    );

    const link = screen.getByRole('link', { name: /dashboard/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');

    expect(screen.getByText('Go to')).toBeInTheDocument();
    expect(screen.getByText('now')).toBeInTheDocument();
  });

  it('hides case-insensitive matches', () => {
    render(
      <SafeLink href="/ADMIN" hiddenRoutes={mockHiddenRoutes}>
        Case Sensitive Admin
      </SafeLink>,
    );

    expect(screen.queryByText('Case Sensitive Admin')).not.toBeInTheDocument();
  });

  it('renders partial matches when they are not paths', () => {
    render(
      <SafeLink href="/administration" hiddenRoutes={mockHiddenRoutes}>
        Administration
      </SafeLink>,
    );

    expect(screen.queryByText('Administration')).toBeInTheDocument();
  });
});
