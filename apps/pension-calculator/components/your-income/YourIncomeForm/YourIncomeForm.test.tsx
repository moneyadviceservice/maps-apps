import {
  emptyRows,
  incomeData,
  mockIncomeFetch,
} from 'test-utils/yourIncomeFormTestUtils';
import { useYourIncomeForm } from 'hooks/useYourIncomeForm';
import { MAX_OTHER_INCOME_ROWS, type YourIncomeErrors } from 'types/income';
import { GROSS_PAY_ID } from 'utils/incomeFieldIds';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';

import { YourIncomeForm } from './YourIncomeForm';

const labelled = (label: string, selector: string) =>
  screen.getByLabelText(label, { selector });

type WrapperProps = {
  initialData?: ReturnType<typeof incomeData>;
  initialErrors?: YourIncomeErrors;
};

const Wrapper = ({
  initialData = incomeData(),
  initialErrors = {},
}: WrapperProps) => {
  const form = useYourIncomeForm({
    sessionId: 'abc',
    initialData,
    initialErrors,
  });

  return (
    <>
      {form.hasErrors && (
        <ErrorSummary
          ref={form.errorSummaryRef}
          title={form.copy.errorSummaryTitle}
          errors={form.errors}
          classNames="mb-2"
        />
      )}
      <YourIncomeForm form={form} />
    </>
  );
};

const wrapper = (props?: WrapperProps) => render(<Wrapper {...props} />);

describe('YourIncomeForm', () => {
  beforeEach(() => {
    mockIncomeFetch({ body: { success: true } });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the income questions and actions', () => {
    wrapper();

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
    wrapper({
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
    wrapper({
      initialData: incomeData({
        otherIncome: emptyRows(2),
      }),
    });

    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(2);
    expect(screen.getByText('Other income 1')).toBeInTheDocument();
  });

  it('hides add another income at the maximum number of rows', () => {
    wrapper({
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
    wrapper();

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
