import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AmountFrequencyField } from './AmountFrequencyField';

const options = [
  { text: 'Per year', value: 'year' },
  { text: 'Per month', value: 'month' },
];

const renderField = (
  overrides?: Partial<Parameters<typeof AmountFrequencyField>[0]>,
) =>
  render(
    <AmountFrequencyField
      amountId="grossPay"
      amountName="grossPay"
      amountValue=""
      amountLabel="Amount"
      frequencyId="grossPayFrequency"
      frequencyName="grossPayFrequency"
      frequencyValue="year"
      frequencyLabel="Frequency"
      frequencyOptions={options}
      legend="What is your pay from work?"
      {...overrides}
    />,
  );

describe('AmountFrequencyField', () => {
  it('renders the legend, amount and frequency without a hint or error', () => {
    renderField();

    expect(
      screen.getByRole('group', { name: 'What is your pay from work?' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Frequency')).toBeInTheDocument();
    expect(screen.queryByText('Enter an amount')).not.toBeInTheDocument();
  });

  it('shows hint and error text and wires aria-describedby', () => {
    renderField({
      hint: 'Before tax',
      error: 'Enter an amount in pounds, like 26900',
      hasError: true,
    });

    const hint = screen.getByText('Before tax');
    const error = screen.getByText('Enter an amount in pounds, like 26900');
    const fieldset = screen.getByRole('group', {
      name: 'What is your pay from work?',
    });

    expect(hint).toHaveAttribute('id', 'grossPay-hint');
    expect(error).toHaveAttribute('id', 'grossPay-error');
    expect(fieldset).toHaveAttribute(
      'aria-describedby',
      'grossPay-hint grossPay-error',
    );
    expect(screen.getByLabelText('Amount')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('calls amount and frequency change handlers', async () => {
    const user = userEvent.setup();
    const onAmountChange = jest.fn();
    const onFrequencyChange = jest.fn();

    renderField({
      amountValue: '100',
      onAmountChange,
      onFrequencyChange,
    });

    await user.type(screen.getByLabelText('Amount'), '0');
    await user.selectOptions(screen.getByLabelText('Frequency'), 'month');

    expect(onAmountChange).toHaveBeenCalled();
    expect(onFrequencyChange).toHaveBeenCalledWith('month');
  });
});
