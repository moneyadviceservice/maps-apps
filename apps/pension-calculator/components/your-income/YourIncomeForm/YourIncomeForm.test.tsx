import { MAX_OTHER_INCOME_ROWS } from 'types/income';
import { GROSS_PAY_ID } from 'utils/incomeFieldIds';
import {
  emptyRows,
  incomeData,
  mockIncomeFetch,
} from 'test-utils/yourIncomeFormTestUtils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { YourIncomeForm } from './YourIncomeForm';

const labelled = (label: string, selector: string) =>
  screen.getByLabelText(label, { selector });

const renderForm = (
  overrides?: Partial<Parameters<typeof YourIncomeForm>[0]>,
) =>
  render(
    <YourIncomeForm
      sessionId="abc"
      initialData={incomeData()}
      initialErrors={{}}
      {...overrides}
    />,
  );

describe('YourIncomeForm', () => {
  beforeEach(() => {
    mockIncomeFetch({ body: { success: true } });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the income questions and actions', () => {
    renderForm();

    expect(
      screen.getByRole('group', {
        name: 'What is your pay from work, before tax and other deductions?',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Continue' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Save and come back later/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add another income' }),
    ).toBeInTheDocument();
  });

  it('shows the error summary when there are errors', () => {
    renderForm({
      initialErrors: {
        [GROSS_PAY_ID]: ['Enter details of your income to continue'],
      },
    });

    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(
      screen.getAllByText('Enter details of your income to continue').length,
    ).toBeGreaterThan(0);
  });

  it('shows remove when there is more than one other-income row', () => {
    renderForm({
      initialData: incomeData({
        otherIncome: emptyRows(2),
      }),
    });

    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(2);
    expect(screen.getByText('Other income 1')).toBeInTheDocument();
  });

  it('hides add another income at the maximum number of rows', () => {
    renderForm({
      initialData: incomeData({
        otherIncome: emptyRows(MAX_OTHER_INCOME_ROWS),
      }),
    });

    expect(
      screen.queryByRole('button', { name: 'Add another income' }),
    ).not.toBeInTheDocument();
  });

  it('updates fields and adds another income row', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(labelled('Amount', '#grossPay'), '26900');
    await user.selectOptions(
      labelled('Frequency', '#grossPayFrequency'),
      'Per month',
    );
    await user.type(screen.getByLabelText('Name'), 'Savings');
    await user.type(labelled('Amount', '#other-income-0-amount'), '100');
    await user.selectOptions(
      labelled('Frequency', '#other-income-0-frequency'),
      'Per year',
    );
    await user.click(
      screen.getByRole('button', { name: 'Add another income' }),
    );

    expect(screen.getByText('Other income 1')).toBeInTheDocument();
    expect(screen.getByText('Other income 2')).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: 'Remove' })[1]);
    expect(screen.queryByText('Other income 2')).not.toBeInTheDocument();
  });
});
