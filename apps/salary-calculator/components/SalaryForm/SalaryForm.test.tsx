import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SalaryForm } from './SalaryForm';
import type { SalaryFormProps, SalaryFormData } from './SalaryForm';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { language: 'en' },
    events: { on: jest.fn(), off: jest.fn() },
  }),
}));

const defaultFormData: SalaryFormData = {
  grossIncome: '50000',
  grossIncomeFrequency: 'annual',
  hoursPerWeek: '40',
  daysPerWeek: '5',
  taxCode: '1257L',
  isScottishResident: false,
  country: 'England/NI/Wales',
  pensionType: 'percentage',
  pensionValue: 5,
  studentLoans: {
    plan1: false,
    plan2: false,
    plan4: false,
    plan5: false,
    planPostGrad: false,
  },
  isBlindPerson: false,
  isOverStatePensionAge: false,
  calculated: false,
};

const defaultProps: SalaryFormProps = {
  formData: defaultFormData,
  calculationType: 'single',
  hideButton: false,
  isNestedForm: false,
};

async function renderAndExpand(props: SalaryFormProps = defaultProps) {
  render(<SalaryForm {...props} />);

  const expandButton = screen.getByText(/Add extra information here/i);
  await userEvent.click(expandButton);

  await waitFor(() =>
    expect(screen.getByTestId('pension-percent')).toBeInTheDocument(),
  );
}

async function expectRadioButtonChecked(testId: string) {
  await waitFor(() => {
    const radio = screen.getByTestId(testId);
    expect((radio as HTMLInputElement).checked).toBe(true);
  });
}

async function expectRadioButtonsExist(...testIds: string[]) {
  await waitFor(() => {
    testIds.forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });
  });
}

describe('SalaryForm', () => {
  describe('Form rendering', () => {
    it('does not include hidden calculationType input when nested', () => {
      render(<SalaryForm {...defaultProps} isNestedForm={true} />);
      const hiddenInputs = document.querySelectorAll(
        'input[name="calculationType"]',
      );
      expect(hiddenInputs.length).toBe(0);
    });
  });

  describe('Form data population', () => {
    it('populates gross income field with provided value', () => {
      render(<SalaryForm {...defaultProps} />);
      const input = screen.getByTestId('gross-income');
      expect(input).toHaveValue('50,000');
    });

    it('populates tax code field with provided value', () => {
      render(<SalaryForm {...defaultProps} />);
      const input = screen.getByTestId('tax-code');
      expect(input).toHaveValue('1257L');
    });

    it('checks Scotland checkbox when isScottishResident is true', () => {
      const props: SalaryFormProps = {
        ...defaultProps,
        formData: { ...defaultFormData, isScottishResident: true },
      };
      render(<SalaryForm {...props} />);

      const checkbox = screen.getByTestId('checkbox-scotland');
      expect(checkbox).toBeChecked();
    });

    it('sets correct frequency in dropdown', () => {
      render(<SalaryForm {...defaultProps} />);

      const select = screen.getByTestId('gross-income-frequency');
      const selectedOption = Array.from(
        (select as HTMLSelectElement).options,
      ).find((option) => option.selected);

      expect(selectedOption).toHaveTextContent('Annual');
    });
  });

  describe('Pay frequency conditional fields', () => {
    it('shows hours per week field when hourly frequency selected', async () => {
      render(<SalaryForm {...defaultProps} />);

      const frequencySelect = screen.getByTestId('gross-income-frequency');
      await userEvent.selectOptions(frequencySelect, 'hourly');

      expect(
        await screen.findByLabelText(
          /How many hours a week do you usually work?/i,
        ),
      ).toBeInTheDocument();
    });

    it('shows days per week field when daily frequency selected', async () => {
      render(<SalaryForm {...defaultProps} />);

      const frequencySelect = screen.getByTestId('gross-income-frequency');
      await userEvent.selectOptions(frequencySelect, 'daily');

      expect(
        await screen.findByLabelText(
          /How many days a week do you usually work?/i,
        ),
      ).toBeInTheDocument();
    });

    it('hides conditional fields for annual frequency', () => {
      render(<SalaryForm {...defaultProps} />);

      expect(
        screen.queryByLabelText(/How many hours a week/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/How many days a week/i),
      ).not.toBeInTheDocument();
    });
  });

  describe('Expandable section - extra information', () => {
    it('shows expandable section for additional information', () => {
      render(<SalaryForm {...defaultProps} />);
      expect(
        screen.getByText(/Add extra information here/i),
      ).toBeInTheDocument();
    });

    it('expands to show pension contribution fields', async () => {
      render(<SalaryForm {...defaultProps} />);

      const expandButton = screen.getByText(/Add extra information here/i);
      await userEvent.click(expandButton);

      expect(
        await screen.findByText(/Monthly pension contributions/i),
      ).toBeInTheDocument();
    });
  });

  describe('Pension contributions', () => {
    it('shows pension percentage input', async () => {
      await renderAndExpand();
      expect(screen.getByTestId('pension-percent')).toBeInTheDocument();
    });

    it('shows pension fixed amount input', async () => {
      await renderAndExpand();
      expect(screen.getByTestId('pension-fixed')).toBeInTheDocument();
    });

    it('clears fixed amount when percentage is entered', async () => {
      await renderAndExpand();

      const percentInput = screen.getByTestId('pension-percent');
      const fixedInput = screen.getByTestId('pension-fixed');

      fireEvent.change(fixedInput, { target: { value: '100' } });
      expect(fixedInput).toHaveValue('100');

      fireEvent.change(percentInput, { target: { value: '5' } });
      expect(percentInput).toHaveValue('5');
    });
  });

  describe('State Pension Age', () => {
    it('checks correct radio button when isOverStatePensionAge is true', async () => {
      const props: SalaryFormProps = {
        ...defaultProps,
        formData: { ...defaultFormData, isOverStatePensionAge: true },
      };

      await renderAndExpand(props);
      await expectRadioButtonChecked('state-pension-yes');
    });
  });

  describe("Blind Person's Allowance", () => {
    it("shows blind person's allowance radio buttons", async () => {
      await renderAndExpand();
      await expectRadioButtonsExist('blind-persons-yes', 'blind-persons-no');
    });

    it('checks correct radio button when isBlindPerson is true', async () => {
      const props: SalaryFormProps = {
        ...defaultProps,
        formData: { ...defaultFormData, isBlindPerson: true },
      };

      await renderAndExpand(props);
      await expectRadioButtonChecked('blind-persons-yes');
    });
  });

  describe('Joint calculation mode', () => {
    it('shows salary number in heading for joint calculation', () => {
      const props: SalaryFormProps = {
        ...defaultProps,
        calculationType: 'joint',
        formNumber: 2,
      };
      render(<SalaryForm {...props} />);

      expect(screen.getByText(/Gross salary 2/i)).toBeInTheDocument();
    });

    it('adds -2 suffix to test IDs for second form', () => {
      const props: SalaryFormProps = {
        ...defaultProps,
        calculationType: 'joint',
        formNumber: 2,
      };
      render(<SalaryForm {...props} />);

      const grossInput = screen.getByTestId('gross-income-2');
      expect(grossInput).toBeInTheDocument();
    });

    it('applies prefix to field names', () => {
      const props: SalaryFormProps = {
        ...defaultProps,
        prefix: 'salary2_',
      };
      const { container } = render(<SalaryForm {...props} />);

      const grossIncomeInput = container.querySelector(
        'input[name="salary2_grossIncome"]',
      );
      expect(grossIncomeInput).toBeInTheDocument();
    });
  });

  describe('Calculate button', () => {
    it('shows "Calculate" when not calculated', () => {
      render(<SalaryForm {...defaultProps} />);
      screen.getByRole('button', { name: /Calculate/i });
    });

    it('shows "Recalculate" when already calculated', () => {
      const props: SalaryFormProps = {
        ...defaultProps,
        formData: { ...defaultFormData, calculated: true },
      };
      render(<SalaryForm {...props} />);
      screen.getByRole('button', { name: /Recalculate/i });
    });

    it('hides button when hideButton is true', () => {
      const props: SalaryFormProps = {
        ...defaultProps,
        hideButton: true,
      };
      render(<SalaryForm {...props} />);
      expect(
        screen.queryByRole('button', { name: /Calculate/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all inputs', () => {
      render(<SalaryForm {...defaultProps} />);

      expect(
        screen.getByLabelText(
          /Gross salary in pounds\. This is your pay before tax and other deductions\./i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Select how often you are paid\./i),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Your tax code/i)).toBeInTheDocument();
    });
  });

  describe('External links', () => {
    it('includes link to Gov.uk tax codes', () => {
      render(<SalaryForm {...defaultProps} />);
      const links = screen.getAllByText(/help on tax codes/i);
      // Find the first link element (in case there are multiple)
      const link = links.find((el) => el.closest('a'))?.closest('a');
      expect(link).toHaveAttribute('href');
      expect(link?.getAttribute('href')).toContain('gov.uk/tax-codes');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('includes link to State Pension age checker', async () => {
      render(<SalaryForm {...defaultProps} />);

      const expandButton = screen.getByText(/Add extra information here/i);
      await userEvent.click(expandButton);

      const link = (
        await screen.findByText(/Check your State Pension age/i)
      ).closest('a');

      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('gov.uk/state-pension-age'),
      );
      expect(link).toHaveAttribute('target', '_blank');
    });

    it("includes link to Blind Person's Allowance", async () => {
      render(<SalaryForm {...defaultProps} />);

      const expandButton = screen.getByText(/Add extra information here/i);
      await userEvent.click(expandButton);

      const link = await screen.findByTestId('bpa-gov-link');

      expect(link).toHaveAttribute('href');
      expect(link?.getAttribute('href')).toContain(
        'gov.uk/blind-persons-allowance',
      );
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  describe('Expandable student loan section', () => {
    it('renders student loan checkboxes when expanded', async () => {
      render(<SalaryForm {...defaultProps} />);

      const expandButton = screen.getByText(/Add extra information here/i);
      await userEvent.click(expandButton);

      await screen.findByText(/Student loan repayments/i);

      // Verify all student loan plan checkboxes are present
      expect(screen.getByTestId('checkbox-plan1')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-plan2')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-plan4')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-plan5')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-plan-post-grad')).toBeInTheDocument();
    });
  });
});
