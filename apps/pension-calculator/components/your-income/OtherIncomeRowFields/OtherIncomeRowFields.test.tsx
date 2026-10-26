import { emptyOtherIncomeRow } from 'types/income';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OtherIncomeRowFields } from './OtherIncomeRowFields';

const options = [
  { text: 'Per year', value: 'year' },
  { text: 'Per month', value: 'month' },
];

const renderRow = (
  overrides?: Partial<Parameters<typeof OtherIncomeRowFields>[0]>,
) =>
  render(
    <OtherIncomeRowFields
      index={0}
      row={emptyOtherIncomeRow()}
      heading="Other income"
      nameLabel="Name"
      namePlaceholder="For example, Savings"
      amountLabel="Amount"
      frequencyLabel="Frequency"
      frequencyOptions={options}
      removeLabel="Remove"
      showRemove={false}
      removeFormAction="/api/your-income?action=remove&index=0"
      onNameChange={jest.fn()}
      onAmountChange={jest.fn()}
      onFrequencyChange={jest.fn()}
      onRemove={jest.fn()}
      {...overrides}
    />,
  );

describe('OtherIncomeRowFields', () => {
  it('hides remove when there is only one row', () => {
    renderRow();

    expect(screen.getByText('Other income')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove' }),
    ).not.toBeInTheDocument();
  });

  it('shows field errors and the remove control', async () => {
    const user = userEvent.setup();
    const onNameChange = jest.fn();
    const onAmountChange = jest.fn();
    const onFrequencyChange = jest.fn();
    const onRemove = jest.fn();

    renderRow({
      row: { name: 'Savings', amount: '10', frequency: 'year' },
      showRemove: true,
      nameError: 'Enter a name for this income',
      amountError: 'Enter an amount for this income',
      onNameChange,
      onAmountChange,
      onFrequencyChange,
      onRemove,
    });

    const nameInput = screen.getByLabelText('Name');
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAttribute(
      'aria-describedby',
      'other-income-0-name-error',
    );
    expect(
      screen.getByText('Enter a name for this income'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Enter an amount for this income'),
    ).toBeInTheDocument();

    await user.type(nameInput, 's');
    await user.type(screen.getByLabelText('Amount'), '0');
    await user.selectOptions(screen.getByLabelText('Frequency'), 'month');
    await user.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onNameChange).toHaveBeenCalled();
    expect(onFrequencyChange).toHaveBeenCalledWith('month');
    expect(onRemove).toHaveBeenCalled();
  });
});
