import { render, screen } from '@testing-library/react';

import { FirmsTableSearch } from './FirmsTableSearch';

import '@testing-library/jest-dom';

describe('FirmsTableSearch', () => {
  it('does not render sort hidden fields when sortBy is unset', () => {
    const { container } = render(<FirmsTableSearch />);
    expect(container.querySelector('input[name="sortBy"]')).toBeNull();
    expect(container.querySelector('input[name="sortDir"]')).toBeNull();
  });

  it('preserves sortBy and sortDir in hidden fields when sorting is active', () => {
    render(<FirmsTableSearch sortBy="firmName" sortDir="desc" />);
    const sortBy = screen.getByDisplayValue('firmName');
    const sortDir = screen.getByDisplayValue('desc');
    expect(sortBy).toHaveAttribute('type', 'hidden');
    expect(sortBy).toHaveAttribute('name', 'sortBy');
    expect(sortDir).toHaveAttribute('name', 'sortDir');
  });
});
