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

  it('uses default idPrefix "filters" in checkbox ids', () => {
    render(<FilterContent query={{}} />);
    const ageCheckbox = document.getElementById('filters-age-age-0-16');
    expect(ageCheckbox).toBeInTheDocument();
  });

  it('uses custom idPrefix when provided', () => {
    render(<FilterContent query={{}} idPrefix="custom" />);
    const ageCheckbox = document.getElementById('custom-age-age-0-16');
    expect(ageCheckbox).toBeInTheDocument();
  });

  it('uses query to set checkbox defaultChecked for filter sections', () => {
    render(<FilterContent query={{ trip_type: 'single_trip' }} />);
    const singleTripCheckbox = document.getElementById(
      'filters-trip_type-single-trip',
    );
    expect(singleTripCheckbox).toBeInTheDocument();
    expect(singleTripCheckbox).toBeChecked();
  });

  it('supports multi-value query for checkboxes', () => {
    render(<FilterContent query={{ age: ['0-16', '70-74'] }} />);
    const age016 = document.getElementById('filters-age-age-0-16');
    const age7074 = document.getElementById('filters-age-age-70-74');
    const age1769 = document.getElementById('filters-age-age-17-69');
    expect(age016).toBeChecked();
    expect(age7074).toBeChecked();
    expect(age1769).not.toBeChecked();
  });

  it('renders noscript for no-JS Apply filters fallback', () => {
    const { container } = render(<FilterContent query={{}} />);
    const noscript = container.querySelector('noscript');
    expect(noscript).toBeInTheDocument();
  });
});
