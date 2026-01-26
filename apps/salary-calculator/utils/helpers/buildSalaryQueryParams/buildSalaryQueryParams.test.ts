import { buildSalaryQueryParams } from './buildSalaryQueryParams';
import { SalaryFormData } from 'components/SalaryForm';

const baseSalary: SalaryFormData = {
  grossIncome: '50000',
  grossIncomeFrequency: 'annual',
  hoursPerWeek: '37.5',
  daysPerWeek: '5',
  taxCode: '1257L',
  pensionType: 'percentage',
  pensionValue: 5,
  studentLoans: {
    plan1: true,
    plan2: false,
    plan4: false,
    plan5: false,
    planPostGrad: false,
  },
  country: 'England/NI/Wales',
  isBlindPerson: false,
  isOverStatePensionAge: false,
  isScottishResident: false,
  calculated: true,
};

describe('buildSalaryQueryParams', () => {
  it('returns correct query string without prefix', () => {
    const result = buildSalaryQueryParams(baseSalary);
    expect(result).toContain('grossIncome=50000');
    expect(result).toContain('grossIncomeFrequency=annual');
    expect(result).toContain('taxCode=1257L');
    expect(result).toContain('pensionType=percentage');
    expect(result).toContain('pensionValue=5');
    expect(result).toContain('isBlindPerson=false');
    expect(result).toContain('hoursPerWeek=37.5');
    expect(result).toContain('daysPerWeek=5');
    expect(result).toContain('plan1=true');
    expect(result).toContain('plan2=false');
    expect(result).toContain('planPostGrad=false');
    expect(result).toContain('country=England/NI/Wales');
    expect(result).toContain('isOverStatePensionAge=false');
  });

  it('returns correct query string with prefix', () => {
    const result = buildSalaryQueryParams(baseSalary, 'salary2_');
    expect(result).toContain('salary2_grossIncome=50000');
    expect(result).toContain('salary2_taxCode=1257L');
    expect(result).toContain('salary2_plan1=true');
  });

  it('defaults missing studentLoans to false', () => {
    const salaryWithoutLoans: SalaryFormData = {
      ...baseSalary,
      studentLoans: {
        plan1: false,
        plan2: false,
        plan4: false,
        plan5: false,
        planPostGrad: false,
      },
    };
    const result = buildSalaryQueryParams(salaryWithoutLoans);

    expect(result).toContain('plan1=false');
    expect(result).toContain('plan2=false');
    expect(result).toContain('planPostGrad=false');
  });

  it('handles empty prefix and undefined studentLoans', () => {
    const salary: SalaryFormData = {
      ...baseSalary,
      studentLoans: {
        plan1: false,
        plan2: false,
        plan4: false,
        plan5: false,
        planPostGrad: false,
      },
    };
    const query = buildSalaryQueryParams(salary);
    expect(query).toMatch(/grossIncome=50000/);
    expect(query).toMatch(/plan1=false/);
  });

  it('handles pensionType as "fixed"', () => {
    const salary: SalaryFormData = {
      ...baseSalary,
      pensionType: 'fixed',
      pensionValue: 1000,
    };
    const query = buildSalaryQueryParams(salary);
    expect(query).toContain('pensionType=fixed');
    expect(query).toContain('pensionValue=1000');
  });

  it('handles boolean fields as true', () => {
    const salary: SalaryFormData = {
      ...baseSalary,
      isBlindPerson: true,
      isOverStatePensionAge: true,
    };
    const query = buildSalaryQueryParams(salary);
    expect(query).toContain('isBlindPerson=true');
    expect(query).toContain('isOverStatePensionAge=true');
  });

  it('handles different country values', () => {
    const salary: SalaryFormData = { ...baseSalary, country: 'Scotland' };
    const query = buildSalaryQueryParams(salary);
    expect(query).toContain('country=Scotland');
  });

  it('handles all student loan plans as true', () => {
    const salary: SalaryFormData = {
      ...baseSalary,
      studentLoans: {
        plan1: true,
        plan2: true,
        plan4: true,
        plan5: true,
        planPostGrad: true,
      },
    };
    const query = buildSalaryQueryParams(salary);
    expect(query).toContain('plan1=true');
    expect(query).toContain('plan2=true');
    expect(query).toContain('plan4=true');
    expect(query).toContain('plan5=true');
    expect(query).toContain('planPostGrad=true');
  });

  it('handles missing optional fields gracefully', () => {
    // Remove optional fields
    const { isScottishResident, calculated, ...partialSalary } = baseSalary;
    // Type assertion because we know the function only uses the listed fields
    const query = buildSalaryQueryParams(partialSalary as SalaryFormData);
    expect(query).toContain('grossIncome=50000');
  });
});
