import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isHoursAllowed, isDaysAllowed } from './SalaryCalculator';
import { SalaryCalculator } from './';
import type { SalaryCalculatorProps } from './';
import type { PensionContributionType } from 'utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import { PayFrequency } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';
import { Country } from 'utils/rates';
import { TaxYear } from 'utils/rates/types';

import '@testing-library/jest-dom';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => require('next-router-mock'));

const props: SalaryCalculatorProps = {
  grossIncome: '30000',
  grossIncomeFrequency: 'annual' as PayFrequency,
  hoursPerWeek: '40',
  daysPerWeek: '5',
  taxCode: '1257L',
  isScottishResident: false,
  isBlindPerson: false,
  pensionType: 'percentage' as PensionContributionType,
  pensionValue: 5,
  country: 'England/NI/Wales' as Country,
  taxYear: '2025/26' as TaxYear,
  isOverStatePensionAge: false,
  calculated: false,
};

describe('SalaryCalculator form', () => {
  it('renders the main form fields', () => {
    render(<SalaryCalculator {...props} />);
    expect(screen.getByLabelText(/Gross salary/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/How many hours a week do you usually work?/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Days per week/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your tax code/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Calculate/i }),
    ).toBeInTheDocument();
  });

  it('renders the results when calculated is true', () => {
    render(<SalaryCalculator {...props} calculated={true} />);
    expect(screen.getByText(/Example Calculation/i)).toBeInTheDocument();
    expect(screen.getByText(/Annual salary:/i)).toBeInTheDocument();
    expect(screen.getByText(/Country:/i)).toBeInTheDocument();
    expect(screen.getByText(/Tax Code:/i)).toBeInTheDocument();
  });

  it('does not render results when calculated is false', () => {
    render(<SalaryCalculator {...props} calculated={false} />);
    expect(screen.queryByText(/Example Calculation/i)).not.toBeInTheDocument();
  });
});

describe('SalaryCalculator NumberInput isAllowed logic', () => {
  it('allows empty input for hours', () => {
    expect(
      isHoursAllowed({ floatValue: undefined, value: '', formattedValue: '0' }),
    ).toBe(true);
  });

  it('allows valid hours within range', () => {
    expect(
      isHoursAllowed({ floatValue: 40, value: '40', formattedValue: '40' }),
    ).toBe(true);
    expect(
      isHoursAllowed({ floatValue: 168, value: '168', formattedValue: '168' }),
    ).toBe(true);
    expect(
      isHoursAllowed({ floatValue: 0, value: '0', formattedValue: '0' }),
    ).toBe(true);
  });

  it('disallows hours above 168', () => {
    expect(
      isHoursAllowed({ floatValue: 169, value: '169', formattedValue: '169' }),
    ).toBe(false);
  });

  it('disallows negative hours', () => {
    expect(
      isHoursAllowed({ floatValue: -1, value: '-1', formattedValue: '-1' }),
    ).toBe(false);
  });

  it('disallows more than 3 digits for hours', () => {
    expect(
      isHoursAllowed({
        floatValue: 1000,
        value: '1000',
        formattedValue: '1000',
      }),
    ).toBe(false);
  });

  it('allows empty input for days', () => {
    expect(
      isDaysAllowed({ floatValue: undefined, value: '', formattedValue: '0' }),
    ).toBe(true);
  });

  it('allows valid days within range', () => {
    expect(
      isDaysAllowed({ floatValue: 5, value: '5', formattedValue: '5' }),
    ).toBe(true);
    expect(
      isDaysAllowed({ floatValue: 7, value: '7', formattedValue: '7' }),
    ).toBe(true);
    expect(
      isDaysAllowed({ floatValue: 0, value: '0', formattedValue: '0' }),
    ).toBe(true);
  });

  it('disallows days above 7', () => {
    expect(
      isDaysAllowed({ floatValue: 8, value: '8', formattedValue: '8' }),
    ).toBe(false);
  });

  it('disallows negative days', () => {
    expect(
      isDaysAllowed({ floatValue: -1, value: '-1', formattedValue: '-1' }),
    ).toBe(false);
  });

  it('disallows more than 1 digit for days', () => {
    expect(
      isDaysAllowed({ floatValue: 10, value: '10', formattedValue: '10' }),
    ).toBe(false);
  });

  it('clears pension percent input when pension fixed input is changed', async () => {
    render(
      <SalaryCalculator {...props} pensionType="fixed" pensionValue={100} />,
    );
    const fixedInput = screen.getByLabelText(
      /Pension contributions fixed amount/i,
    );
    const percentInput = screen.getByLabelText(
      /Pension contributions percentage/i,
    );

    // Type a new value into the fixed input
    await userEvent.clear(fixedInput);
    await userEvent.type(fixedInput, '250');

    // The fixed input should have the new value
    expect(fixedInput).toHaveValue('250');

    // The percent input should be cleared
    expect(percentInput).toHaveValue('');
  });

  it('clears pension fixed pension input when percent input is changed', async () => {
    render(
      <SalaryCalculator {...props} pensionType="percentage" pensionValue={5} />,
    );
    const fixedInput = screen.getByLabelText(
      /Pension contributions fixed amount/i,
    );
    const percentInput = screen.getByLabelText(
      /Pension contributions percentage/i,
    );

    // Type a new value into the fixed input
    await userEvent.clear(percentInput);
    await userEvent.type(percentInput, '5');

    // The fixed input should have the new value
    expect(fixedInput).toHaveValue('');

    // The percent input should be cleared
    expect(percentInput).toHaveValue('5');
  });

  it('updates pay frequency when user selects a different option', async () => {
    render(<SalaryCalculator {...props} />);
    const select = screen.getByLabelText(/Gross income frequency/i);

    // Change from 'annual' to 'monthly'
    await userEvent.selectOptions(select, 'monthly');
    expect((select as HTMLSelectElement).value).toBe('monthly');

    // Change from 'monthly' to 'weekly'
    await userEvent.selectOptions(select, 'weekly');
    expect((select as HTMLSelectElement).value).toBe('weekly');
  });
});
