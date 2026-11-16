import type { FilterSectionConfig } from 'data/components/filterOptions/filterConstants';
import { FILTER_SECTIONS } from 'data/components/filterOptions/filterConstants';
import { render, screen } from '@testing-library/react';

import { FilterSection } from './FilterSection';

import '@testing-library/jest-dom';

const z = (t: { en: string; cy: string }) => t.en;

const tripTypeConfig = FILTER_SECTIONS.find((c) => c.paramKey === 'trip_type')!;
const isCruiseConfig = FILTER_SECTIONS.find((c) => c.paramKey === 'is_cruise')!;
const ageConfig = FILTER_SECTIONS.find((c) => c.paramKey === 'age')!;
const tripLengthConfig = FILTER_SECTIONS.find(
  (c) => c.paramKey === 'trip_length',
)!;

/** Override for emptyItemText behaviour testing (production configs don't use it). */
const configWithEmptyOption: FilterSectionConfig = {
  ...tripTypeConfig,
  control: 'radio' as const,
  options: tripTypeConfig.options.slice(0, 2),
  emptyItemText: { en: 'Select type', cy: 'Dewiswch fath' },
};

describe('FilterSection', () => {
  const defaultProps = {
    idPrefix: 'filters',
    radioValue: () => '',
    checkboxValues: () => [] as string[],
    z,
  };

  it('renders section title', () => {
    render(<FilterSection config={configWithEmptyOption} {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Filter by insurance type' }),
    ).toBeInTheDocument();
  });

  it('renders More information expandable with title', () => {
    render(<FilterSection config={configWithEmptyOption} {...defaultProps} />);
    expect(screen.getByText('More information')).toBeInTheDocument();
  });

  it('renders moreInfo content', () => {
    render(<FilterSection config={configWithEmptyOption} {...defaultProps} />);
    expect(
      screen.getByText(/Depending on what medical condition/i),
    ).toBeInTheDocument();
  });

  it('renders radios with empty option when emptyItemText is set and control is radio', () => {
    render(<FilterSection config={configWithEmptyOption} {...defaultProps} />);
    expect(screen.getByLabelText('Select type')).toBeInTheDocument();
    expect(screen.getByLabelText('Single trip')).toBeInTheDocument();
    expect(screen.getByLabelText('Annual multi-trip')).toBeInTheDocument();
  });

  it('renders checkboxes for trip type options', () => {
    render(<FilterSection config={tripTypeConfig} {...defaultProps} />);
    expect(screen.getByLabelText('Single trip')).toBeInTheDocument();
    expect(screen.getByLabelText('Annual multi-trip')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(2);
  });

  it('renders checkboxes for cruise options', () => {
    render(<FilterSection config={isCruiseConfig} {...defaultProps} />);
    expect(screen.getByLabelText('Land based')).toBeInTheDocument();
    expect(screen.getByLabelText('Cruise')).toBeInTheDocument();
  });

  it('uses idPrefix in control ids', () => {
    render(
      <FilterSection
        config={tripTypeConfig}
        {...defaultProps}
        idPrefix="sidebar"
      />,
    );
    expect(
      document.getElementById('sidebar-trip_type-single-trip'),
    ).toBeInTheDocument();
  });

  it('checks checkbox when checkboxValues includes option value', () => {
    render(
      <FilterSection
        config={isCruiseConfig}
        {...defaultProps}
        checkboxValues={() => ['true']}
      />,
    );
    const cruiseCheckbox = screen.getByLabelText('Cruise');
    expect(cruiseCheckbox).toBeChecked();
  });

  it('renders age range checkboxes', () => {
    render(<FilterSection config={ageConfig} {...defaultProps} />);
    expect(screen.getByLabelText('0 - 16')).toBeInTheDocument();
    expect(screen.getByLabelText('17 - 69')).toBeInTheDocument();
    expect(screen.getByLabelText('70 - 74')).toBeInTheDocument();
    expect(screen.getByLabelText('75 - 85')).toBeInTheDocument();
    expect(screen.getByLabelText('86 +')).toBeInTheDocument();
  });

  it('renders trip length checkboxes', () => {
    render(<FilterSection config={tripLengthConfig} {...defaultProps} />);
    expect(screen.getByLabelText('Up to 30 days')).toBeInTheDocument();
    expect(screen.getByLabelText('Up to 90 days')).toBeInTheDocument();
    expect(screen.getByLabelText('90+ days')).toBeInTheDocument();
  });
});
