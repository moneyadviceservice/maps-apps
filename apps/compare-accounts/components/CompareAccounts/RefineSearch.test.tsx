import { fireEvent, render, screen } from '@testing-library/react';

import RefineSearch from './RefineSearch';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { language: 'en', searchQuery: 'test' },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({
    z: jest.fn(({ en }) => en),
  }),
}));

describe('RefineSearch Component', () => {
  it('renders correctly with default state', () => {
    render(<RefineSearch />);

    const headerFilters = screen.getByTestId('header-filters');
    expect(headerFilters).toBeInTheDocument();

    const buttonFilters = screen.getByTestId('button-filters');
    expect(buttonFilters).toBeInTheDocument();

    const applyFiltersButton = screen.getByRole('button', {
      name: 'Apply filters',
    });
    expect(applyFiltersButton).toBeInTheDocument();
  });

  it('renders correctly with showRefineSearch false', () => {
    render(<RefineSearch />);

    const buttonFilters = screen.getByTestId('apply-filters-button');
    expect(buttonFilters).toBeInTheDocument();

    const applyFiltersButton = screen.getByRole('button', {
      name: 'Apply filters',
    });
    expect(applyFiltersButton).toBeInTheDocument();
  });

  it('applies a filter and changes the UI', () => {
    render(<RefineSearch />);

    const standardCurrentCheckbox = screen.getByLabelText('Standard current');
    fireEvent.click(standardCurrentCheckbox);

    expect(standardCurrentCheckbox).toBeChecked();
  });

  it('toggles the refine search visibility on mobile with click or keydown', () => {
    render(<RefineSearch />);

    const mobileFilterButton = screen.getByTestId('button-filters');

    fireEvent.click(mobileFilterButton);
    expect(mobileFilterButton).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(mobileFilterButton, { key: ' ', code: 'Space' });
    expect(mobileFilterButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.keyDown(mobileFilterButton, { key: 'Enter', code: 'Enter' });
    expect(mobileFilterButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('changes button state on click and shows loading spinner', () => {
    render(<RefineSearch />);

    const button = screen.getByTestId('apply-filters-button');

    expect(button).toHaveClass('t-primary-button');

    fireEvent.click(button);

    expect(button).toHaveClass('t-loading-button');
  });
});
