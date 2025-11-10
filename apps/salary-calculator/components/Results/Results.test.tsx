import { render, screen } from '@testing-library/react';
import { SalaryCalculatorResults } from './Results';
import type { PensionContributionType } from 'utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import { PayFrequency } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';
import { Country } from 'utils/rates';
import { TaxYear } from 'utils/rates/types';

import '@testing-library/jest-dom';

import '@testing-library/jest-dom/extend-expect';

const defaultProps = {
  grossIncome: '30000',
  grossIncomeFrequency: 'annual' as PayFrequency,
  hoursPerWeek: '40',
  daysPerWeek: '5',
  taxCode: '1257L',
  isBlindPerson: false,
  pensionType: 'percentage' as PensionContributionType,
  pensionValue: 5,
  country: 'England/NI/Wales' as Country,
  taxYear: '2025/26' as TaxYear,
  isOverStatePensionAge: false,
};

describe('SalaryCalculatorResults', () => {
  it('renders all breakdown sections and values', () => {
    render(<SalaryCalculatorResults {...defaultProps} />);
    expect(screen.getByText(/Example Calculation/i)).toBeInTheDocument();
    expect(screen.getByText(/Annual salary:/i)).toBeInTheDocument();
    expect(screen.getByText(/Country:/i)).toBeInTheDocument();
    expect(screen.getByText(/Tax Code:/i)).toBeInTheDocument();

    expect(screen.getByText(/Annual Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Weekly Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Breakdown/i)).toBeInTheDocument();

    expect(screen.getAllByText(/Income tax:/i).length).toBe(4);
    expect(screen.getAllByText(/National insurance:/i).length).toBe(4);
    expect(screen.getAllByText(/Pension contributions:/i).length).toBe(4);
    expect(screen.getAllByText(/Net salary:/i).length).toBe(4);
  });

  it('renders correct values for props', () => {
    render(<SalaryCalculatorResults {...defaultProps} />);
    expect(screen.getByText(/Annual salary: £/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Country: England\/NI\/Wales/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Tax Code: 1257L/i)).toBeInTheDocument();
  });

  it('handles empty grossIncome gracefully', () => {
    render(<SalaryCalculatorResults {...defaultProps} grossIncome="" />);
    expect(screen.getByText(/Annual salary: £0/i)).toBeInTheDocument();
  });

  it('handles empty daysPerWeek and hoursPerWeek gracefully', () => {
    render(
      <SalaryCalculatorResults
        {...defaultProps}
        daysPerWeek=""
        hoursPerWeek=""
      />,
    );
    expect(screen.getByText(/Annual salary:/i)).toBeInTheDocument();
  });
});
