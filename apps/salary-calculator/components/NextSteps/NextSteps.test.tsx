import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { NextSteps } from './NextSteps';
import type { SalaryData } from '../ResultsSingleSalary';
import React from 'react';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (obj: any) => obj.en,
    locale: 'en',
  }),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockSalary = (
  overStatePensionAge = false,
  isBlindPerson = false,
  grossIncome = 37000,
): SalaryData => ({
  grossIncome: grossIncome.toString(),
  grossIncomeFrequency: 'annual',
  hoursPerWeek: '',
  daysPerWeek: '',
  taxCode: '',
  isBlindPerson,
  pensionType: 'percentage',
  pensionValue: 0,
  studentLoans: {
    plan1: false,
    plan2: false,
    plan4: false,
    plan5: false,
    planPostGrad: false,
  },
  country: 'England/NI/Wales',
  isOverStatePensionAge: overStatePensionAge,
});

describe('NextSteps Component', () => {
  it('renders the H1 heading', () => {
    render(<NextSteps salary1={mockSalary()} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Next steps',
    );
  });

  it('renders main sections in the correct order for grossIncome <= 37430', () => {
    render(<NextSteps salary1={mockSalary(false, false, 37000)} />);
    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((h) => h.textContent);
    expect(headings).toEqual([
      'Manage your money',
      'Get help with the cost of living',
      'Look at your savings',
      'Save into a pension',
    ]);
  });

  it('renders main sections in the correct order for grossIncome > 37430', () => {
    render(<NextSteps salary1={mockSalary(false, false, 38000)} />);
    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((h) => h.textContent);
    expect(headings).toEqual([
      'Look at your savings',
      'Save into a pension',
      'Manage your money',
      'Get help with the cost of living',
    ]);
  });

  it('renders state pension section if either salary has isOverStatePensionAge true', () => {
    render(
      <NextSteps salary1={mockSalary(false)} salary2={mockSalary(true)} />,
    );
    expect(
      screen.getByText(/Understand the State Pension/i),
    ).toBeInTheDocument();
  });

  it('does not render state pension section if both salaries have isOverStatePensionAge false', () => {
    render(
      <NextSteps salary1={mockSalary(false)} salary2={mockSalary(false)} />,
    );
    expect(
      screen.queryByText(/Understand the State Pension/i),
    ).not.toBeInTheDocument();
  });

  it('renders blind person section if either salary has isBlindPerson true', () => {
    render(
      <NextSteps
        salary1={mockSalary(false)}
        salary2={mockSalary(false, true)}
      />,
    );
    expect(
      screen.getByText(/Help if you're living with an illness or disability/i),
    ).toBeInTheDocument();
  });

  it('does not render blind person section if both salaries have isBlindPerson false', () => {
    render(
      <NextSteps salary1={mockSalary(false)} salary2={mockSalary(false)} />,
    );
    expect(
      screen.queryByText(
        /Help if you're living with an illness or disability/i,
      ),
    ).not.toBeInTheDocument();
  });
});
