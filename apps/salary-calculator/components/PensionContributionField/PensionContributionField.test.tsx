import { render, screen } from '@testing-library/react';

import type { PensionContributionFieldProps } from './PensionContributionField';
import { PensionContributionField } from './PensionContributionField';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    z: jest.fn((key) => key.en),
  })),
}));

const defaultProps: PensionContributionFieldProps = {
  valueId: 'pensionValue',
  typeId: 'pensionType',
  valueTestId: 'pension-value',
  typeTestId: 'pension-type',
  label: {
    en: 'How much do you contribute each month?',
    cy: 'Faint ydych chi’n ei gyfrannu bob mis?',
  },
  hint: {
    en: 'Enter either an amount or percentage.',
    cy: 'Rhowch naill ai swm neu ganran.',
  },
};

describe('PensionContributionField', () => {
  it('renders the question, hint, amount input and type select', () => {
    render(<PensionContributionField {...defaultProps} />);

    expect(
      screen.getByText('How much do you contribute each month?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Enter either an amount or percentage.'),
    ).toBeInTheDocument();

    const input = screen.getByTestId('pension-value');
    expect(input).toHaveAttribute('id', 'pensionValue');
    expect(input).toHaveAttribute('name', 'pensionValue');
    expect(input).toHaveValue('');

    const select = screen.getByTestId('pension-type');
    expect(select).toHaveAttribute('id', 'pensionType');
    expect(select).toHaveAttribute('name', 'pensionType');
    expect(select).toHaveValue('percentage');
  });

  it('offers a percentage and a fixed amount option', () => {
    render(<PensionContributionField {...defaultProps} />);

    const options = screen.getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual([
      '% of your salary',
      'amount in £',
    ]);
    expect(
      options.map((option) => (option as HTMLOptionElement).value),
    ).toEqual(['percentage', 'fixed']);
  });

  it('labels both controls with the question and describes the input with the hint', () => {
    render(<PensionContributionField {...defaultProps} />);

    const controls = screen.getAllByLabelText(
      'How much do you contribute each month?',
    );
    expect(controls).toHaveLength(2);
    expect(controls).toContain(screen.getByTestId('pension-value'));
    expect(controls).toContain(screen.getByTestId('pension-type'));

    expect(screen.getByTestId('pension-value')).toHaveAttribute(
      'aria-describedby',
      'pensionValue-hint',
    );
    expect(
      screen.getByText('Enter either an amount or percentage.'),
    ).toHaveAttribute('id', 'pensionValue-hint');
  });

  it('adds a screen reader suffix to the label', () => {
    render(
      <PensionContributionField
        {...defaultProps}
        ariaLabelSuffix="Gross salary 2."
      />,
    );

    expect(
      screen.getAllByLabelText(
        'How much do you contribute each month? Gross salary 2.',
      ),
    ).toHaveLength(2);
    expect(screen.getByText('Gross salary 2.')).toHaveClass('sr-only');
  });

  it('prefills the amount and the type', () => {
    render(
      <PensionContributionField
        {...defaultProps}
        defaultValue="150.5"
        defaultType="fixed"
      />,
    );

    expect(screen.getByTestId('pension-value')).toHaveValue('150.5');
    expect(screen.getByTestId('pension-type')).toHaveValue('fixed');
  });

  it('shows errors above the controls and links them to the input', () => {
    render(
      <PensionContributionField
        {...defaultProps}
        errors={['Your monthly pension contributions must be less than £100']}
      />,
    );

    const error = document.getElementById('pensionValueError');
    expect(error).toHaveTextContent(
      'Your monthly pension contributions must be less than £100',
    );
    expect(screen.getByTestId('pension-value')).toHaveAttribute(
      'aria-describedby',
      'pensionValue-hint pensionValueError',
    );
  });
});
