import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { NoScriptSwitcher } from './NoScriptSwitcher';
import { SalaryFormData } from 'components/SalaryForm';
import { buildSalaryQueryParams } from '../../utils/helpers/buildSalaryQueryParams';

// Mock next/link to render a normal anchor
jest.mock('next/link', () => {
  return ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

const mockZ = ({ en }: { en: string; cy: string }) => en;

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

describe('NoscriptSwitcher', () => {
  it('does not render both links at once', () => {
    render(
      <NoScriptSwitcher
        calculationType="single"
        salary1={baseSalary}
        locale="en"
        z={mockZ}
      />,
    );

    expect(screen.queryByText('Single calculation')).not.toBeInTheDocument();
  });

  it('renders a noscript wrapper', () => {
    const { container } = render(
      <NoScriptSwitcher
        calculationType="single"
        salary1={baseSalary}
        locale="en"
        z={mockZ}
      />,
    );

    expect(container.querySelector('noscript')).toBeInTheDocument();
  });
});

describe('buildSalaryQueryParams', () => {
  it('builds correct query string without prefix', () => {
    const result = buildSalaryQueryParams(baseSalary);
    expect(result).toContain('grossIncome=50000');
    expect(result).toContain('taxCode=1257L');
    expect(result).toContain('plan1=true');
    expect(result).toContain('plan2=false');
    expect(result).not.toContain('salary2_'); // no prefix
  });

  it('builds correct query string with prefix', () => {
    const result = buildSalaryQueryParams(baseSalary, 'salary2_');
    expect(result).toContain('salary2_grossIncome=50000');
    expect(result).toContain('salary2_taxCode=1257L');
    expect(result).toContain('salary2_plan1=true');
  });
});

describe('NoScriptSwitcher', () => {
  it('renders a noscript wrapper', () => {
    const { container } = render(
      <NoScriptSwitcher
        calculationType="single"
        salary1={baseSalary}
        locale="en"
        z={mockZ}
      />,
    );

    expect(container.querySelector('noscript')).toBeInTheDocument();
  });
});
