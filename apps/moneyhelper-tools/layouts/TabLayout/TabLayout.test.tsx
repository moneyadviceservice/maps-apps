import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TabLayout } from './TabLayout';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { tab: '1' },
  }),
}));

Element.prototype.scrollTo = jest.fn();

describe('TabLayout', () => {
  const defaultProps = {
    tabLinks: ['Tab 1', 'Tab 2', 'Tab 3'],
    currentTab: 1,
    tabHeadings: ['Heading 1', 'Heading 2', 'Heading 3'],
    tabContent: [
      <div key={1}>Tab 1 Content</div>,
      <div key={2}>Tab 2 Content</div>,
      <div key={3}>Tab 3 Content</div>,
    ],
    toolBaseUrl: '/example',
    hasErrors: false,
  };

  it('renders without errors', () => {
    render(<TabLayout {...defaultProps} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 1 Content')).toBeInTheDocument();
  });

  it('renders correct number of tab links', () => {
    render(<TabLayout {...defaultProps} />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('renders tab links with correct props', () => {
    render(<TabLayout {...defaultProps} />);
    const tabLinks = screen.getAllByRole('tab');
    expect(tabLinks[0]).toHaveTextContent('Tab 1');
    expect(tabLinks[0]).toHaveAttribute('href', '/example1');
    expect(tabLinks[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabLinks[1]).toHaveTextContent('Tab 2');
    expect(tabLinks[1]).toHaveAttribute('href', '/example2');
    expect(tabLinks[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('renders tab body with correct heading and action', () => {
    render(<TabLayout {...defaultProps} />);
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 1 Content')).toBeInTheDocument();
  });
});
