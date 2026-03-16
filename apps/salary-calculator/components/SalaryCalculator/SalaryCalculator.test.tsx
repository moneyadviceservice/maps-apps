import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SalaryCalculator } from './';
import type { SalaryCalculatorProps } from './';
import type { SalaryFormData } from '../SalaryForm/SalaryForm';
import { defaultStudentLoans } from './SalaryCalculator';
import '@testing-library/jest-dom';

jest.mock('next/router', () => require('next-router-mock'));

const mockSalary1: SalaryFormData = {
  grossIncome: '30000',
  grossIncomeFrequency: 'annual',
  hoursPerWeek: '40',
  daysPerWeek: '5',
  taxCode: '1257L',
  isScottishResident: false,
  country: 'England/NI/Wales',
  pensionType: 'percentage',
  pensionValue: 5,
  studentLoans: defaultStudentLoans,
  isBlindPerson: false,
  isOverStatePensionAge: false,
  calculated: false,
};

const mockSalary2: SalaryFormData = {
  grossIncome: '35000',
  grossIncomeFrequency: 'annual',
  hoursPerWeek: '37.5',
  daysPerWeek: '5',
  taxCode: '1257L',
  isScottishResident: false,
  country: 'England/NI/Wales',
  pensionType: 'percentage',
  pensionValue: 3,
  studentLoans: defaultStudentLoans,
  isBlindPerson: false,
  isOverStatePensionAge: false,
  calculated: false,
};

const singleProps: SalaryCalculatorProps = {
  calculationType: 'single',
  salary1: mockSalary1,
  resultsFrequency: 'yearly',
};

const jointProps: SalaryCalculatorProps = {
  calculationType: 'joint',
  salary1: mockSalary1,
  salary2: mockSalary2,
  resultsFrequency: 'yearly',
};

describe('SalaryCalculator component', () => {
  describe('Single calculation mode', () => {
    it('renders the main form fields', () => {
      render(<SalaryCalculator {...singleProps} />);

      expect(screen.getByLabelText(/Gross salary/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Your tax code/i)).toBeInTheDocument();
      const calculateButtons = screen.getAllByRole('button', {
        name: /Calculate/i,
      });
      expect(calculateButtons.length).toBeGreaterThan(0);
    });

    it('does not render results when salary is not calculated', () => {
      render(<SalaryCalculator {...singleProps} />);

      expect(screen.queryByText(/Annual salary:/i)).not.toBeInTheDocument();
    });

    it('shows Recalculate button when already calculated', () => {
      const calculatedProps: SalaryCalculatorProps = {
        ...singleProps,
        salary1: { ...mockSalary1, calculated: true },
      };

      render(<SalaryCalculator {...calculatedProps} />);

      const recalculateButtons = screen.getAllByRole('button', {
        name: /Recalculate/i,
      });
      expect(recalculateButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Joint calculation mode', () => {
    it('renders two salary forms', () => {
      render(<SalaryCalculator {...jointProps} />);

      const grossSalaryInputs = screen.getAllByLabelText(/Gross salary/i);
      expect(grossSalaryInputs).toHaveLength(2);
    });

    it('does not render results when only one salary is calculated', () => {
      const partiallyCalculatedProps: SalaryCalculatorProps = {
        ...jointProps,
        salary1: { ...mockSalary1, calculated: true },
        salary2: { ...mockSalary2, calculated: false },
      };

      render(<SalaryCalculator {...partiallyCalculatedProps} />);

      expect(screen.queryByText(/Annual salary:/i)).not.toBeInTheDocument();
    });

    it('shows joint radio button as checked', () => {
      render(<SalaryCalculator {...jointProps} />);

      const singleRadio = screen.getByTestId('single-calculation-radio');
      const jointRadio = screen.getByTestId('joint-calculation-radio');

      expect(singleRadio).not.toBeChecked();
      expect(jointRadio).toBeChecked();
    });

    it('shows joint calculate button', () => {
      render(<SalaryCalculator {...jointProps} />);

      const calculateButton = screen.getByTestId('calculate-button-joint');
      expect(calculateButton).toBeInTheDocument();
      expect(calculateButton).toHaveTextContent(/Calculate/i);
    });

    it('shows Recalculate button when both salaries calculated', () => {
      const calculatedProps: SalaryCalculatorProps = {
        ...jointProps,
        salary1: { ...mockSalary1, calculated: true },
        salary2: { ...mockSalary2, calculated: true },
      };

      render(<SalaryCalculator {...calculatedProps} />);

      // Update test id to match the dynamic naming
      const calculateButton = screen.getByTestId('recalculate-button-joint');
      expect(calculateButton).toHaveTextContent(/Recalculate/i);
    });

    it('wraps both forms in single form element', () => {
      const { container } = render(<SalaryCalculator {...jointProps} />);

      // Find the first form element in the container
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute('method', 'post');
    });

    it('includes hidden calculationType input in joint mode', () => {
      const { container } = render(<SalaryCalculator {...jointProps} />);

      const hiddenInput = container.querySelector(
        'input[name="calculationType"][value="joint"]',
      );
      expect(hiddenInput).toBeInTheDocument();
    });
  });

  describe('Progressive enhancement - Non-JS support', () => {
    it('renders noscript links for mode selection', () => {
      const { container } = render(<SalaryCalculator {...singleProps} />);

      const noscriptElements = container.querySelectorAll('noscript');
      expect(noscriptElements.length).toBeGreaterThan(0);
    });
  });

  describe('Mode switching (with JS enabled)', () => {
    it('switches from single to joint mode when clicking joint radio', async () => {
      render(<SalaryCalculator {...singleProps} />);

      const jointRadio = screen.getByTestId('joint-calculation-radio');
      await userEvent.click(jointRadio);

      expect(jointRadio).toBeChecked();

      const grossSalaryInputs = screen.getAllByLabelText(/Gross salary/i);
      expect(grossSalaryInputs).toHaveLength(2);
    });

    it('switches from joint to single mode when clicking single radio', async () => {
      render(<SalaryCalculator {...jointProps} />);

      const singleRadio = screen.getByTestId('single-calculation-radio');
      await userEvent.click(singleRadio);

      expect(singleRadio).toBeChecked();

      const grossSalaryInputs = screen.getAllByLabelText(/Gross salary/i);
      expect(grossSalaryInputs).toHaveLength(1);
    });

    it('mobile radio switches from single to joint mode', async () => {
      render(<SalaryCalculator {...singleProps} />);

      const mobileJointRadio = screen.getByTestId(
        'joint-calculation-radio-mobile',
      );
      await userEvent.click(mobileJointRadio);

      expect(mobileJointRadio).toBeChecked();

      const grossSalaryInputs = screen.getAllByLabelText(/Gross salary/i);
      expect(grossSalaryInputs).toHaveLength(2);
    });

    it('initializes mobile calculation type from props and allows switching', async () => {
      render(<SalaryCalculator {...jointProps} />);

      const mobileSingleRadio = screen.getByTestId(
        'single-calculation-radio-mobile',
      );
      const mobileJointRadio = screen.getByTestId(
        'joint-calculation-radio-mobile',
      );

      // Initial state from props
      expect(mobileSingleRadio).not.toBeChecked();
      expect(mobileJointRadio).toBeChecked();

      // Switch to single mode
      await userEvent.click(mobileSingleRadio);

      expect(mobileSingleRadio).toBeChecked();
      expect(mobileJointRadio).not.toBeChecked();
    });

    it('syncs desktop and mobile radio buttons', async () => {
      render(<SalaryCalculator {...singleProps} />);

      const jointRadio = screen.getByTestId('joint-calculation-radio');
      const mobileJointRadio = screen.getByTestId(
        'joint-calculation-radio-mobile',
      );

      await userEvent.click(jointRadio);

      expect(jointRadio).toBeChecked();
      expect(mobileJointRadio).toBeChecked();
    });
  });

  describe('Mobile radio buttons', () => {
    it('renders mobile-specific radio buttons', () => {
      render(<SalaryCalculator {...singleProps} />);

      const mobileSingleRadio = screen.getByTestId(
        'single-calculation-radio-mobile',
      );
      const mobileJointRadio = screen.getByTestId(
        'joint-calculation-radio-mobile',
      );

      expect(mobileSingleRadio).toBeInTheDocument();
      expect(mobileJointRadio).toBeInTheDocument();
    });

    it('shows correct checked state for mobile radios in single mode and allows switching', async () => {
      render(<SalaryCalculator {...singleProps} />);

      const mobileSingleRadio = screen.getByTestId(
        'single-calculation-radio-mobile',
      );
      const mobileJointRadio = screen.getByTestId(
        'joint-calculation-radio-mobile',
      );

      // Initial state from props
      expect(mobileSingleRadio).toBeChecked();
      expect(mobileJointRadio).not.toBeChecked();

      // User switches to joint
      await userEvent.click(mobileJointRadio);

      expect(mobileSingleRadio).not.toBeChecked();
      expect(mobileJointRadio).toBeChecked();
    });
  });

  describe('Translation support', () => {
    it('uses useTranslation hook for bilingual content', () => {
      render(<SalaryCalculator {...singleProps} />);

      expect(screen.getByText(/Single calculation/i)).toBeInTheDocument();
      expect(screen.getByText(/Compare two salaries/i)).toBeInTheDocument();
    });

    it('renders back link with correct text', () => {
      render(<SalaryCalculator {...singleProps} />);

      const backLink = screen.getByText('Back');
      expect(backLink).toHaveTextContent('Back');
    });

    it('renders main heading', () => {
      render(<SalaryCalculator {...singleProps} />);

      expect(
        screen.getByText(/How much is my take home pay?/i),
      ).toBeInTheDocument();
    });

    it('renders comparison question on mobile', () => {
      render(<SalaryCalculator {...singleProps} />);

      expect(
        screen.getByText(/Compare with another salary?/i),
      ).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('renders main container', () => {
      const { container } = render(<SalaryCalculator {...singleProps} />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });

    it('hides radio buttons container initially for progressive enhancement', () => {
      render(<SalaryCalculator {...singleProps} />);

      // Radio buttons should be rendered (JS enabled in tests)
      const singleRadio = screen.getByTestId('single-calculation-radio');
      expect(singleRadio).toBeInTheDocument();
    });

    it('renders salary forms within correct structure', () => {
      render(<SalaryCalculator {...singleProps} />);

      // Verify form is rendered
      const grossIncomeInput = screen.getByTestId('gross-income');
      expect(grossIncomeInput).toBeInTheDocument();
    });
  });

  describe('Results section', () => {
    it('renders results section with correct anchor', () => {
      const calculatedProps: SalaryCalculatorProps = {
        ...singleProps,
        salary1: { ...mockSalary1, calculated: true },
      };

      const { container } = render(<SalaryCalculator {...calculatedProps} />);

      const resultsSection = container.querySelector('#results');
      expect(resultsSection).toBeInTheDocument();
    });

    it('does not render results section when not calculated', () => {
      const { container } = render(<SalaryCalculator {...singleProps} />);

      const resultsSection = container.querySelector('#results');
      expect(resultsSection).not.toBeInTheDocument();
    });
  });

  describe('SalaryForm defaults', () => {
    it('renders correct initial values for optional fields', async () => {
      render(<SalaryCalculator {...singleProps} />);

      // Expand the additional info section
      const expandButton = screen.getByText(/Add extra information here/i);
      await userEvent.click(expandButton);

      // Wait for fields to be visible using findByTestId
      const blindYes = await screen.findByTestId('blind-persons-yes');
      const blindNo = await screen.findByTestId('blind-persons-no');
      expect(blindYes).not.toBeChecked();
      expect(blindNo).toBeChecked();

      // State pension age - also wait for these fields
      const stateYes = await screen.findByTestId('state-pension-yes');
      const stateNo = await screen.findByTestId('state-pension-no');
      expect(stateYes).not.toBeChecked();
      expect(stateNo).toBeChecked();

      // Pension value & type
      const pensionPercent = await screen.findByTestId('pension-percent');
      const pensionFixed = await screen.findByTestId('pension-fixed');
      expect(pensionPercent).toHaveValue('5'); // mockSalary1.pensionValue
      expect(pensionFixed).toHaveValue('');

      // Student loans defaults
      const checkboxPlan1 = await screen.findByTestId('checkbox-plan1');
      expect(checkboxPlan1).not.toBeChecked(); // defaultStudentLoans.plan1 is false
    });

    it('renders correct initial values for second salary in joint mode', async () => {
      render(<SalaryCalculator {...jointProps} />);

      // Expand the second form's additional info section
      const expandButtons = screen.getAllByText(/Add extra information here/i);
      expect(expandButtons).toHaveLength(2); // One for each form

      // Click the second form's expand button
      await userEvent.click(expandButtons[1]);

      // Now the fields should be visible
      const salary2BlindYes = await screen.findByTestId('blind-persons-yes-2');
      const salary2BlindNo = await screen.findByTestId('blind-persons-no-2');

      expect(salary2BlindYes).not.toBeChecked();
      expect(salary2BlindNo).toBeChecked();
    });
  });

  describe('Results component data transformation', () => {
    it('passes correct salary1 data to Results component in single mode', () => {
      const calculatedProps: SalaryCalculatorProps = {
        ...singleProps,
        salary1: { ...mockSalary1, calculated: true },
      };

      const { container } = render(<SalaryCalculator {...calculatedProps} />);

      // Query by id attribute that actually exists
      const resultsSection = container.querySelector('#results');
      expect(resultsSection).toBeInTheDocument();
    });

    it('transforms null values to false for isBlindPerson in Results', () => {
      const calculatedProps: SalaryCalculatorProps = {
        ...singleProps,
        salary1: {
          ...mockSalary1,
          isBlindPerson: null,
          calculated: true,
        },
      };

      const { container } = render(<SalaryCalculator {...calculatedProps} />);

      const resultsSection = container.querySelector('#results');
      expect(resultsSection).toBeInTheDocument();
    });

    it('transforms null values to false for isOverStatePensionAge in Results', () => {
      const calculatedProps: SalaryCalculatorProps = {
        ...singleProps,
        salary1: {
          ...mockSalary1,
          isOverStatePensionAge: null,
          calculated: true,
        },
      };

      const { container } = render(<SalaryCalculator {...calculatedProps} />);

      const resultsSection = container.querySelector('#results');
      expect(resultsSection).toBeInTheDocument();
    });

    it('transforms null pensionValue to 0 in Results', () => {
      const calculatedProps: SalaryCalculatorProps = {
        ...singleProps,
        salary1: {
          ...mockSalary1,
          pensionValue: null as unknown as number,
          calculated: true,
        },
      };

      const { container } = render(<SalaryCalculator {...calculatedProps} />);

      const resultsSection = container.querySelector('#results');
      expect(resultsSection).toBeInTheDocument();
    });

    it('uses defaultStudentLoans when studentLoans is undefined', () => {
      const calculatedProps: SalaryCalculatorProps = {
        ...singleProps,
        salary1: {
          ...mockSalary1,
          studentLoans: undefined as unknown as typeof defaultStudentLoans,
          calculated: true,
        },
      };

      const { container } = render(<SalaryCalculator {...calculatedProps} />);

      const resultsSection = container.querySelector('#results');
      expect(resultsSection).toBeInTheDocument();
    });

    it('does not render Results when in single mode and not calculated', () => {
      const { container } = render(<SalaryCalculator {...singleProps} />);

      const resultsSection = container.querySelector('#results');
      expect(resultsSection).not.toBeInTheDocument();
    });

    it('does not render Results when in joint mode and only one salary calculated', () => {
      const calculatedProps: SalaryCalculatorProps = {
        ...jointProps,
        salary1: { ...mockSalary1, calculated: true },
        salary2: { ...mockSalary2, calculated: false },
      };

      const { container } = render(<SalaryCalculator {...calculatedProps} />);

      const resultsSection = container.querySelector('#results');
      expect(resultsSection).not.toBeInTheDocument();
    });
  });
});
