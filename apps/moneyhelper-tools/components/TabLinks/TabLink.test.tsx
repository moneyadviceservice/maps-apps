import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TabLink } from './TabLink';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/mocked-path'),
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: { language: 'en' },
  })),
}));

describe('TabLink', () => {
  const defaultProps = {
    hrefPathname: '/test',
    selected: false,
    tab: 1,
  };

  it('renders without errors', () => {
    render(<TabLink {...defaultProps}>Test Link</TabLink>);
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('applies default link classes when not selected', () => {
    render(<TabLink {...defaultProps}>Test Link</TabLink>);
    const link = screen.getByText('Test Link');
    expect(link).toHaveClass('t-step-navigation__button');
    expect(link).not.toHaveClass('border-b-4', '!text-blue-800');
  });

  it('applies active link classes when selected', () => {
    render(
      <TabLink {...defaultProps} selected={true}>
        Test Link
      </TabLink>,
    );
    const link = screen.getByText('Test Link');
    expect(link).toHaveClass('border-b-4', '!text-blue-800');
  });

  it('applies active link classes when pathname matches hrefPathname', () => {
    render(
      <TabLink hrefPathname="/mocked-path" selected={false} tab={1}>
        Test Link
      </TabLink>,
    );
    const link = screen.getByText('Test Link');
    expect(link).toHaveClass('border-b-4', '!text-blue-800');
  });

  it('sets href attribute correctly', () => {
    render(<TabLink {...defaultProps}>Test Link</TabLink>);
    const link = screen.getByText('Test Link').closest('a');
    expect(link).toHaveAttribute('href', defaultProps.hrefPathname);
  });
});
