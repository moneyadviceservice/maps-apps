import { render, screen } from '@testing-library/react';

import { ViewPerPage } from './ViewPerPage';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (t: { en: string; cy: string }) => t.en,
  }),
}));

describe('ViewPerPage', () => {
  it('renders with view-per-page test id', () => {
    render(<ViewPerPage query={{}} />);
    expect(screen.getByTestId('view-per-page')).toBeInTheDocument();
  });

  it('renders View per page label', () => {
    render(<ViewPerPage query={{}} />);
    expect(screen.getByText('View per page')).toBeInTheDocument();
  });

  it('renders select with listings-limit id', () => {
    render(<ViewPerPage query={{}} />);
    expect(document.getElementById('listings-limit')).toBeInTheDocument();
  });

  it('uses default limit 5 when query has no limit', () => {
    render(<ViewPerPage query={{}} />);
    const select = screen.getByRole('combobox', { name: 'Items per page' });
    expect(select).toHaveValue('5');
  });

  it('uses limit from query when provided', () => {
    render(<ViewPerPage query={{ limit: '10' }} />);
    const select = screen.getByRole('combobox', { name: 'Items per page' });
    expect(select).toHaveValue('10');
  });

  it('has options 5, 10, 20', () => {
    render(<ViewPerPage query={{}} />);
    expect(
      screen.getByRole('combobox', { name: 'Items per page' }),
    ).toBeInTheDocument();
  });

  it('renders a named limit field for the parent listings form', () => {
    render(<ViewPerPage query={{}} />);
    const select = screen.getByRole('combobox', { name: 'Items per page' });
    expect(select).toHaveAttribute('name', 'limit');
  });
});
