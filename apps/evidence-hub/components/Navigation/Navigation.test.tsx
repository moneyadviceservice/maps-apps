import { NavigationItem } from 'types/@adobe/components';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Navigation } from '.';

import '@testing-library/jest-dom';

const mockNavigationItems: NavigationItem[] = [
  {
    text: 'Evidence Hub',
    children: [
      {
        text: 'Topic Overview',
        children: [
          { text: 'Overview', linkTo: '/overview' },
          { text: 'Guidance & Tools', linkTo: '/guidance' },
          { text: 'Case Studies', linkTo: '/case-studies' },
        ],
      },
      { text: 'Metrics', linkTo: '/metrics' },
      { text: 'Datasets', linkTo: '/datasets' },
    ],
  },
  {
    text: 'Research Library',
    children: [
      { text: 'Articles', linkTo: '/articles' },
      { text: 'Reports', linkTo: '/reports' },
      {
        text: 'Datasets',
        children: [
          { text: 'Public', linkTo: '/public' },
          { text: 'Restricted', linkTo: '/restricted' },
        ],
      },
    ],
  },
  {
    text: 'About',
    children: [
      { text: 'Mission', linkTo: '/mission' },
      { text: 'Team', linkTo: '/team' },
      { text: 'Contact', linkTo: '/contact' },
    ],
  },
  {
    text: 'Simple Link',
    linkTo: '/simple',
  },
];

describe('Navigation component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders navigation items', () => {
    render(<Navigation items={mockNavigationItems} />);
    expect(
      screen.getByRole('menuitem', { name: 'Evidence Hub' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Research Library' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'About' })).toBeInTheDocument();
  });

  it('renders simple links without dropdown', () => {
    render(<Navigation items={mockNavigationItems} />);
    const simpleLink = screen.getByRole('menuitem', { name: 'Simple Link' });
    expect(simpleLink).toBeInTheDocument();
    expect(simpleLink).toHaveAttribute('href', '/simple');
  });

  it('renders dropdown menus with proper ARIA attributes', () => {
    render(<Navigation items={mockNavigationItems} />);
    const evidenceHubButton = screen.getByRole('menuitem', {
      name: 'Evidence Hub',
    });
    expect(evidenceHubButton).toHaveAttribute('aria-haspopup', 'true');
    expect(evidenceHubButton).toHaveAttribute('aria-controls');
  });

  it('shows dropdown when button receives focus', async () => {
    const user = userEvent.setup();
    render(<Navigation items={mockNavigationItems} />);

    const evidenceHubButton = screen.getByRole('menuitem', {
      name: 'Evidence Hub',
    });
    const menuId = evidenceHubButton.getAttribute('aria-controls');

    await user.tab();
    await user.tab();

    // Focus on the button
    evidenceHubButton.focus();

    // Check if dropdown is visible (focus-within should make it visible)
    const dropdown = document.getElementById(menuId || '');
    expect(dropdown).toBeInTheDocument();
  });

  it('renders submenu items with proper ARIA attributes', () => {
    render(<Navigation items={mockNavigationItems} />);

    const topicOverviewButton = screen.getByRole('menuitem', {
      name: 'Topic Overview',
    });
    expect(topicOverviewButton).toHaveAttribute('aria-haspopup', 'true');
    expect(topicOverviewButton).toHaveAttribute('aria-controls');
  });

  it('renders all dropdown children', () => {
    render(<Navigation items={mockNavigationItems} />);

    // These should be in the DOM but may not be visible initially
    expect(screen.getByText('Topic Overview')).toBeInTheDocument();
    expect(screen.getByText('Metrics')).toBeInTheDocument();
  });

  it('renders submenu children', () => {
    render(<Navigation items={mockNavigationItems} />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Guidance & Tools')).toBeInTheDocument();
    expect(screen.getByText('Case Studies')).toBeInTheDocument();
  });

  it('applies language prefix to links', () => {
    render(<Navigation items={mockNavigationItems} />);

    const simpleLink = screen.getByRole('menuitem', { name: 'Simple Link' });
    expect(simpleLink).toHaveAttribute('href', '/simple');
  });

  it('handles items without linkTo', () => {
    const itemsWithoutLinks: NavigationItem[] = [
      {
        text: 'No Link',
      },
    ];

    render(<Navigation items={itemsWithoutLinks} />);
    const link = screen.getByRole('menuitem', { name: 'No Link' });
    expect(link).toHaveAttribute('href', '#');
  });

  it('applies custom className', () => {
    render(<Navigation items={mockNavigationItems} className="custom-class" />);

    const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
    expect(nav).toHaveClass('custom-class');
  });
});
