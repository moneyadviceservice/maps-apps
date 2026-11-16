import { render, screen, within } from '@testing-library/react';

import { SideNavigation } from './SideNavigation';
import { mockSideNavigation } from './sideNavigationMocks';

import '@testing-library/jest-dom';

let mockAsPath = '/en/learning-pathway-intro';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: mockAsPath,
  }),
}));

describe('SideNavigation', () => {
  beforeEach(() => {
    mockAsPath = '/en/learning-pathway-intro';
  });

  it('renders every navigation item in the order set in AEM', () => {
    render(<SideNavigation lang="en" navigation={mockSideNavigation} />);

    const items = within(screen.getByTestId('side-navigation')).getAllByRole(
      'listitem',
    );

    expect(items.map((item) => item.textContent)).toEqual([
      'About the framework',
      'Learning pathway',
      'Latest quality updates',
    ]);
  });

  it('prefixes each link with the current language', () => {
    render(<SideNavigation lang="cy" navigation={mockSideNavigation} />);

    expect(
      screen.getByRole('link', { name: 'About the framework' }),
    ).toHaveAttribute('href', '/cy/framework');
  });

  it('renders the current page as text rather than a link', () => {
    render(<SideNavigation lang="en" navigation={mockSideNavigation} />);

    expect(
      screen.queryByRole('link', { name: 'Learning pathway' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Learning pathway')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('matches the landing page when the link is the site root', () => {
    mockAsPath = '/en';

    render(<SideNavigation lang="en" navigation={mockSideNavigation} />);

    expect(screen.getByText('Latest quality updates')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it.each([
    ['the pathway list', '/en/learning-pathway'],
    ['a pathway detail page', '/en/learning-pathway/getting-started'],
  ])('highlights Learning pathway on %s', (_, path) => {
    mockAsPath = path;

    render(<SideNavigation lang="en" navigation={mockSideNavigation} />);

    expect(screen.getByText('Learning pathway')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('highlights only the current item on a pathway detail page', () => {
    mockAsPath = '/en/learning-pathway/getting-started';

    render(<SideNavigation lang="en" navigation={mockSideNavigation} />);

    expect(
      screen.getByRole('link', { name: 'Latest quality updates' }),
    ).toBeInTheDocument();
  });

  it('ignores query strings and hashes when matching the current page', () => {
    mockAsPath = '/en/learning-pathway-intro?order=newest#top';

    render(<SideNavigation lang="en" navigation={mockSideNavigation} />);

    expect(screen.getByText('Learning pathway')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('labels the navigation landmark with the AEM navigation title', () => {
    render(<SideNavigation lang="en" navigation={mockSideNavigation} />);

    expect(
      screen.getByRole('navigation', { name: 'Debt Quality' }),
    ).toBeInTheDocument();
  });
});
