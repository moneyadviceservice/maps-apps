import type { FilterSectionConfig } from 'data/components/filterOptions/filterConstants';
import { FILTER_SECTIONS } from 'data/components/filterOptions/filterConstants';
import { render, screen } from '@testing-library/react';

import { FilterSection } from './FilterSection';

import '@testing-library/jest-dom';

const z = (t: { en: string; cy: string }) => t.en;

const tripTypeConfig = FILTER_SECTIONS.find((c) => c.paramKey === 'trip_type')!;
const isCruiseConfig = FILTER_SECTIONS.find((c) => c.paramKey === 'is_cruise')!;
const ageNumberConfig = FILTER_SECTIONS.find((c) => c.paramKey === 'age')!;
const placeholderConfig = FILTER_SECTIONS.find(
  (c) => c.paramKey === '_length_placeholder',
)!;
const tripLengthSingleConfig = FILTER_SECTIONS.find(
  (c) => c.paramKey === 'trip_length' && c.wrapperClassName === 'single',
)!;

/** Only FILTER_SECTIONS config that uses emptyItemText is tested here; production has none. Minimal override for behaviour. */
const configWithEmptyOption: FilterSectionConfig = {
  ...tripTypeConfig,
  options: tripTypeConfig.options.slice(0, 2),
  emptyItemText: { en: 'Select type', cy: 'Dewiswch fath' },
};

describe('FilterSection', () => {
  const defaultProps = {
    idPrefix: 'filters',
    radioValue: () => '',
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

  it('renders radios with empty option when emptyItemText is set', () => {
    render(<FilterSection config={configWithEmptyOption} {...defaultProps} />);
    expect(screen.getByLabelText('Select type')).toBeInTheDocument();
    expect(screen.getByLabelText('Single Trip')).toBeInTheDocument();
    expect(screen.getByLabelText('Annual Multi-Trip')).toBeInTheDocument();
  });

  it('renders radio buttons for all options', () => {
    render(<FilterSection config={tripTypeConfig} {...defaultProps} />);
    expect(screen.getByLabelText('Single Trip')).toBeInTheDocument();
    expect(screen.getByLabelText('Annual Multi-Trip')).toBeInTheDocument();
  });

  it('renders Yes/No radio buttons', () => {
    render(<FilterSection config={isCruiseConfig} {...defaultProps} />);
    expect(screen.getByLabelText('Yes')).toBeInTheDocument();
    expect(screen.getByLabelText('No')).toBeInTheDocument();
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

  it('checks radio when radioValue matches option value', () => {
    render(
      <FilterSection
        config={isCruiseConfig}
        {...defaultProps}
        radioValue={() => 'true'}
      />,
    );
    const yesRadio = screen.getByLabelText('Yes');
    expect(yesRadio).toBeChecked();
  });

  it('renders number input when control is number', () => {
    render(
      <FilterSection
        config={ageNumberConfig}
        {...defaultProps}
        radioValue={() => '35'}
      />,
    );
    const input = document.getElementById('filters-age') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'age');
    expect(input).toHaveAttribute('placeholder', 'Enter age');
    expect(input).toHaveValue('35');
  });

  it('renders only placeholder copy when placeholderCopy is set', () => {
    render(<FilterSection config={placeholderConfig} {...defaultProps} />);
    expect(
      screen.getByText('Please select the type of insurance first.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });

  it('wraps section in div with wrapperClassName when wrapperClassName is set', () => {
    const { container } = render(
      <FilterSection config={tripLengthSingleConfig} {...defaultProps} />,
    );
    const wrapper = container.querySelector('.single');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('single');
    expect(
      screen.getByRole('heading', { name: 'Length of Single Trip' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Up to 1 month')).toBeInTheDocument();
  });
});
