import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SalaryForm } from './SalaryForm';
import type { SalaryFormProps, SalaryFormData } from './SalaryForm';
import { mockMatchMedia } from '../../utils/mocks/matchMedia';

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
  employerPensionType: 'percentage',
  employerPensionValue: 0,
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
    expect(screen.getByTestId('pension-value')).toBeInTheDocument(),
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
  beforeAll(() => {
    mockMatchMedia(window);
  });

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
    it('shows an amount input and a type select for employee and employer', async () => {
      await renderAndExpand();

      expect(screen.getByTestId('pension-value')).toBeInTheDocument();
      expect(screen.getByTestId('pension-type')).toBeInTheDocument();
      expect(screen.getByTestId('employer-pension-value')).toBeInTheDocument();
      expect(screen.getByTestId('employer-pension-type')).toBeInTheDocument();
    });

    it('selects "% of your salary" and leaves the amounts blank by default', async () => {
      await renderAndExpand({
        ...defaultProps,
        formData: { ...defaultFormData, pensionValue: 0 },
      });

      expect(screen.getByTestId('pension-value')).toHaveValue('');
      expect(screen.getByTestId('pension-type')).toHaveValue('percentage');
      expect(screen.getByTestId('employer-pension-value')).toHaveValue('');
      expect(screen.getByTestId('employer-pension-type')).toHaveValue(
        'percentage',
      );
    });

    it('prefills the amounts and types from the form data', async () => {
      await renderAndExpand({
        ...defaultProps,
        formData: {
          ...defaultFormData,
          pensionType: 'fixed',
          pensionValue: 200,
          employerPensionType: 'percentage',
          employerPensionValue: 3,
        },
      });

      expect(screen.getByTestId('pension-value')).toHaveValue('200');
      expect(screen.getByTestId('pension-type')).toHaveValue('fixed');
      expect(screen.getByTestId('employer-pension-value')).toHaveValue('3');
      expect(screen.getByTestId('employer-pension-type')).toHaveValue(
        'percentage',
      );
    });

    it('submits the fields as a type and a value, with the salary 2 prefix', async () => {
      await renderAndExpand({ ...defaultProps, prefix: 'salary2_' });

      expect(screen.getByTestId('pension-value')).toHaveAttribute(
        'name',
        'salary2_pensionValue',
      );
      expect(screen.getByTestId('pension-type')).toHaveAttribute(
        'name',
        'salary2_pensionType',
      );
      expect(screen.getByTestId('employer-pension-value')).toHaveAttribute(
        'name',
        'salary2_employerPensionValue',
      );
      expect(screen.getByTestId('employer-pension-type')).toHaveAttribute(
        'name',
        'salary2_employerPensionType',
      );
    });

    it('shows the pension questions before the net pay arrangement note', async () => {
      await renderAndExpand();

      const question = screen.getByText(
        /How much does your employer contribute each month/i,
      );
      const note = screen.getByText(/net pay arrangement/i);

      expect(
        question.compareDocumentPosition(note) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
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

      expect(
        screen.getByRole('heading', { name: /Gross salary 2/i, level: 2 }),
      ).toBeInTheDocument();
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
          /Gross salary in pounds\. This is your pay before tax and other deductions \(often called Gross salary\)\./i,
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

  it('does not set aria-describedby on MoneyInput when there is no error', () => {
    render(<SalaryForm {...defaultProps} />);
    const input = screen.getByTestId('gross-income');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('renders additional info section when there are pension errors', () => {
    const props: SalaryFormProps = {
      ...defaultProps,
      errors: JSON.stringify([
        { field: 'pensionValue', message: 'Pension error' },
      ]),
    };
    render(<SalaryForm {...props} />);
    expect(screen.getByTestId('additional-info-section')).toBeVisible();
  });

  it('renders all student loan checkboxes', async () => {
    await renderAndExpand();
    expect(screen.getByTestId('checkbox-plan1')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-plan2')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-plan4')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-plan5')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-plan-post-grad')).toBeInTheDocument();
  });

  it('renders all accessibility labels for gross income', () => {
    render(<SalaryForm {...defaultProps} />);
    const input = screen.getByTestId('gross-income');
    expect(input).toHaveAttribute('aria-label');
  });

  it('renders all accessibility labels for tax code', () => {
    render(<SalaryForm {...defaultProps} />);
    const input = screen.getByTestId('tax-code');
    expect(input).toHaveAttribute('aria-label');
  });

  it('labels the pension amount input and type select with the question', async () => {
    await renderAndExpand();

    const controls = screen.getAllByLabelText(
      /How much do you contribute into your pension/i,
    );
    expect(controls).toHaveLength(2);
    expect(screen.getByTestId('pension-value')).toHaveAttribute(
      'aria-describedby',
      'pensionValue-hint',
    );
  });

  it('labels the employer amount input and type select with the question', async () => {
    await renderAndExpand();

    const controls = screen.getAllByLabelText(
      /How much does your employer contribute each month/i,
    );
    expect(controls).toHaveLength(2);
  });

  it('renders all accessibility labels for days per week', async () => {
    render(<SalaryForm {...defaultProps} />);
    const frequencySelect = screen.getByTestId('gross-income-frequency');
    await userEvent.selectOptions(frequencySelect, 'daily');
    const input = await screen.findByTestId('days-per-week');
    expect(input).toHaveAttribute('aria-label');
  });

  it('renders all accessibility labels for hours per week', async () => {
    render(<SalaryForm {...defaultProps} />);
    const frequencySelect = screen.getByTestId('gross-income-frequency');
    await userEvent.selectOptions(frequencySelect, 'hourly');
    const input = await screen.findByTestId('hours-per-week');
    expect(input).toHaveAttribute('aria-label');
  });

  it('renders all accessibility labels for Scotland checkbox', () => {
    render(<SalaryForm {...defaultProps} />);
    const input = screen.getByTestId('checkbox-scotland');
    expect(input).toHaveAttribute('aria-label');
  });

  it('renders all accessibility labels for state pension radio buttons', async () => {
    await renderAndExpand();
    expect(screen.getByTestId('state-pension-yes')).toHaveAttribute(
      'aria-label',
    );
    expect(screen.getByTestId('state-pension-no')).toHaveAttribute(
      'aria-label',
    );
  });

  it('renders all accessibility labels for blind person radio buttons', async () => {
    await renderAndExpand();
    expect(screen.getByTestId('blind-persons-yes')).toHaveAttribute(
      'aria-label',
    );
    expect(screen.getByTestId('blind-persons-no')).toHaveAttribute(
      'aria-label',
    );
  });

  it('renders Gov.uk tax code link with correct href', () => {
    render(<SalaryForm {...defaultProps} />);
    const link = screen.getByText(/help on tax codes/i).closest('a');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('gov.uk/tax-codes'),
    );
  });

  it('renders State Pension age link with correct href', async () => {
    await renderAndExpand();
    const link = screen.getByText(/Check your State Pension age/i).closest('a');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('gov.uk/state-pension-age'),
    );
  });

  it("renders Blind Person's Allowance link with correct href", async () => {
    await renderAndExpand();
    const link = await screen.findByTestId('bpa-gov-link');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('gov.uk/blind-persons-allowance'),
    );
  });

  it.each([
    {
      testName: 'gross income error message',
      errors: [{ field: 'grossIncome', type: 'income-required' }],
      wrapperId: 'grossIncomeError',
      expectedText: 'Enter your gross salary',
    },
    {
      testName: 'days per week error message',
      errors: [{ field: 'daysPerWeek', type: 'days-per-week-invalid' }],
      wrapperId: 'daysPerWeekError',
      expectedText: 'Enter the number of days a week you work',
      formDataOverride: { grossIncomeFrequency: 'daily' as const },
    },
    {
      testName: 'hours per week error message',
      errors: [{ field: 'hoursPerWeek', type: 'hours-per-week-invalid' }],
      wrapperId: 'hoursPerWeekError',
      expectedText: 'Enter the number of hours a week you work',
      formDataOverride: { grossIncomeFrequency: 'hourly' as const },
    },
    {
      testName: 'tax code error message',
      errors: [{ field: 'taxCode', type: 'tax-code-invalid' }],
      wrapperId: 'taxCodeError',
      expectedText: 'It looks like your tax code is not correct.',
    },
    {
      testName: 'pension fixed error message',
      errors: [{ field: 'pensionValue', type: 'pension-fixed-invalid' }],
      wrapperId: 'pensionValueError',
      expectedText: 'Your monthly pension contributions must be less than',
      extraText: '£4166.67 (your monthly gross income)',
    },
    {
      testName: 'employer pension percent error message',
      errors: [
        {
          field: 'employerPensionValue',
          type: 'employer-pension-percent-range',
        },
      ],
      wrapperId: 'employerPensionValueError',
      expectedText:
        "Your employer's monthly pension contributions must be less than 100% of your income",
    },
    {
      testName: 'employer pension fixed error message',
      errors: [
        {
          field: 'employerPensionValue',
          type: 'employer-pension-fixed-invalid',
        },
      ],
      wrapperId: 'employerPensionValueError',
      expectedText:
        "Your employer's monthly pension contributions must be less than",
      extraText: '£4166.67 (your monthly gross income)',
    },
  ])(
    'shows $testName',
    ({ errors, wrapperId, expectedText, extraText, formDataOverride }) => {
      const props: SalaryFormProps = {
        ...defaultProps,
        formData: { ...defaultFormData, ...formDataOverride },
        errors: JSON.stringify(errors),
      };

      render(<SalaryForm {...props} />);

      const wrapper = document.getElementById(wrapperId);
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveTextContent(expectedText);

      if (extraText) {
        expect(wrapper).toHaveTextContent(extraText);
      }
    },
  );
});
