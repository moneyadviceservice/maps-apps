import { LinkType } from 'types/@adobe/components';
import { render, screen } from '@testing-library/react';

import { NavigationItem } from '../NavigationItem';

import '@testing-library/jest-dom';

const mockLinkItem: LinkType = {
  linkTo: '/test-link',
  text: 'Test Link',
  description: null,
};

describe('NavigationItem', () => {
  const lang = 'en';

  it('renders the navigation link with correct href and text', () => {
    render(
      <NavigationItem
        lang={lang}
        linkItem={mockLinkItem}
        isLastLink={false}
        isActive={false}
      />,
    );

    const link = screen.getByRole('link', { name: /test link/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/en/test-link');
    expect(link).toHaveTextContent('Test Link');
  });

  it('applies active classes when isActive is true', () => {
    render(
      <NavigationItem
        lang={lang}
        linkItem={mockLinkItem}
        isLastLink={false}
        isActive={true}
      />,
    );

    const link = screen.getByRole('link');

    expect(link).toHaveClass('bg-green-300');
    expect(link).toHaveClass('font-bold');
    expect(link).toHaveClass('hover:bg-green-300');
  });

  it('applies last link classes when isLastLink is true', () => {
    render(
      <NavigationItem
        lang={lang}
        linkItem={mockLinkItem}
        isLastLink={true}
        isActive={false}
      />,
    );

    const link = screen.getByRole('link');

    expect(link).toHaveClass('lg:rounded-bl-[23px]');
    expect(link).toHaveClass('after:content-none');
  });

  it('applies both active and last link classes together', () => {
    render(
      <NavigationItem
        lang={lang}
        linkItem={mockLinkItem}
        isLastLink={true}
        isActive={true}
      />,
    );

    const link = screen.getByRole('link');

    expect(link).toHaveClass('bg-green-300');
    expect(link).toHaveClass('lg:rounded-bl-[23px]');
    expect(link).toHaveClass('font-bold');
  });
});
