import React from 'react';
import { render } from '@testing-library/react';
import { Salary2Data } from './Salary2Data';
import { SalaryFormData } from 'components/SalaryForm';

describe('Salary2Data', () => {
  const mockSalary2: SalaryFormData = {
    grossIncome: '50000',
    grossIncomeFrequency: 'annual',
    hoursPerWeek: '37.5',
    daysPerWeek: '5',
    taxCode: '1257L',
    isScottishResident: true,
    pensionType: 'percentage',
    pensionValue: 5,
    studentLoans: {
      plan1: true,
      plan2: false,
      plan4: true,
      plan5: false,
      planPostGrad: true,
    },
    isBlindPerson: true,
    isOverStatePensionAge: false,
    country: 'England/NI/Wales',
    calculated: true,
  };

  it('renders hidden inputs with correct values', () => {
    const { container } = render(<Salary2Data salary2Data={mockSalary2} />);

    // Helper to get hidden input by name
    const getHiddenInputValue = (name: string) =>
      (container.querySelector(`input[name="${name}"]`) as HTMLInputElement)
        ?.value;

    // Check basic fields
    expect(getHiddenInputValue('salary2_grossIncome')).toBe(
      mockSalary2.grossIncome,
    );
    expect(getHiddenInputValue('salary2_grossIncomeFrequency')).toBe(
      mockSalary2.grossIncomeFrequency,
    );
    expect(getHiddenInputValue('salary2_hoursPerWeek')).toBe(
      mockSalary2.hoursPerWeek,
    );
    expect(getHiddenInputValue('salary2_daysPerWeek')).toBe(
      mockSalary2.daysPerWeek,
    );
    expect(getHiddenInputValue('salary2_taxCode')).toBe(mockSalary2.taxCode);

    // Boolean fields
    expect(getHiddenInputValue('salary2_isScottishResident')).toBe('true');
    expect(getHiddenInputValue('salary2_isBlindPerson')).toBe('true');
    expect(getHiddenInputValue('salary2_isOverStatePensionAge')).toBe('false');

    // Pension
    expect(getHiddenInputValue('salary2_pensionPercent')).toBe('5');
    expect(getHiddenInputValue('salary2_pensionFixed')).toBe('');

    // Student loans
    expect(getHiddenInputValue('salary2_plan1')).toBe('true');
    expect(getHiddenInputValue('salary2_plan2')).toBe('false');
    expect(getHiddenInputValue('salary2_plan4')).toBe('true');
    expect(getHiddenInputValue('salary2_plan5')).toBe('false');
    expect(getHiddenInputValue('salary2_planPostGrad')).toBe('true');
  });
});
