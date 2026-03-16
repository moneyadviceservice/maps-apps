import { render, screen } from '@testing-library/react';

import { FilterContent } from './FilterContent';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (t: { en: string; cy: string }) => t.en,
  }),
}));

describe('FilterContent', () => {
  it('renders with travel-insurance-filters test id', () => {
    render(<FilterContent query={{}} />);
    expect(screen.getByTestId('travel-insurance-filters')).toBeInTheDocument();
  });

  it('renders FilterSection for each filter config', () => {
    render(<FilterContent query={{}} />);
    expect(
      screen.getByRole('heading', { name: 'Age at time of travel' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Filter by insurance type' }),
    ).toBeInTheDocument();
  });

  it('uses default idPrefix "filters" when not provided', () => {
    render(<FilterContent query={{}} />);
    const ageInput = document.getElementById('filters-age');
    expect(ageInput).toBeInTheDocument();
  });

  it('uses custom idPrefix when provided', () => {
    render(<FilterContent query={{}} idPrefix="custom" />);
    const ageInput = document.getElementById('custom-age');
    expect(ageInput).toBeInTheDocument();
  });

  it('uses query to set radioValue for filter sections', () => {
    render(<FilterContent query={{ trip_type: 'single_trip' }} />);
    const singleTripRadio =
      document.getElementById('filters-trip_type-single-trip') ||
      document.querySelector('input[value="single_trip"]');
    expect(singleTripRadio).toBeInTheDocument();
  });

  it('renders noscript for no-JS Apply filters fallback', () => {
    const { container } = render(<FilterContent query={{}} />);
    const noscript = container.querySelector('noscript');
    expect(noscript).toBeInTheDocument();
  });
});
