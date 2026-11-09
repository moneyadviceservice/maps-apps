import { render, screen } from '@testing-library/react';

import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('renders its children and forwards anchor attributes', () => {
    render(
      <SkipLink href="#main-content" aria-label="Skip to main content">
        Skip to content
      </SkipLink>,
    );

    const link = screen.getByRole('link', { name: 'Skip to main content' });

    expect(link).toHaveAttribute('href', '#main-content');
    expect(link).toHaveTextContent('Skip to content');
  });

  it('merges custom classes with its default styles', () => {
    render(
      <SkipLink href="#main-content" className="text-red-500 rounded-none">
        Skip to content
      </SkipLink>,
    );

    const link = screen.getByRole('link', { name: 'Skip to content' });

    expect(link).toHaveClass('absolute', 'bottom-full', 'right-full');
    expect(link).toHaveClass('text-red-500', 'rounded-none');
    expect(link).not.toHaveClass('text-gray-800', 'rounded');
  });
});
