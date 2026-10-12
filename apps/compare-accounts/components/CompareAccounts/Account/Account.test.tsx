import { render } from '@testing-library/react';

import { AccountProps } from '../CompareAccounts';
import Account from './Account';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: { language: 'en' },
  })),
}));

jest.mock('../../../utils/CompareAccounts/formatMoney', () => {
  return jest.fn((money) => {
    if (!money) {
      return '';
    }
    return `£${money.amount.toFixed(2)}`;
  });
});

jest.mock('../AccountExpandedView', () => {
  return jest.fn(() => <div data-testid="mocked-account-expanded-view" />);
});

const createAccount = (
  overrides: Partial<AccountProps> = {},
): Partial<AccountProps> => ({
  providerName: 'Provider Name',
  name: 'Account Name',
  url: 'https://example.com',
  monthlyFee: { amount: 10, currency: 'GBP', scale: 2 },
  minimumMonthlyCredit: { amount: 100, currency: 'GBP', scale: 2 },
  representativeAPR: 5,
  unauthODMonthlyCap: { amount: 50, currency: 'GBP', scale: 2 },
  ...overrides,
});

describe('Account Component', () => {
  it('renders account details with correct values', () => {
    const account = createAccount();

    const { getByTestId } = render(
      <Account account={account as AccountProps} />,
    );

    expect(getByTestId('table-data-value-0').textContent).toBe('£10.00');
    expect(getByTestId('table-data-value-1').textContent).toBe('£100.00');
    expect(getByTestId('table-data-value-2').textContent).toBe('5%');
    expect(getByTestId('table-data-value-3').textContent).toBe('£50.00');
  });

  it('renders "No limit" when unauthODMonthlyCap is null', () => {
    const account = createAccount({ unauthODMonthlyCap: null });

    const { getByTestId } = render(
      <Account account={account as AccountProps} />,
    );

    expect(getByTestId('table-data-value-3').textContent).toBe('No limit');
  });

  it('renders "Not offered" when unauthODMonthlyCap amount is 0', () => {
    const account = createAccount({
      unauthODMonthlyCap: { amount: 0, currency: 'GBP', scale: 2 },
    });

    const { getByTestId } = render(
      <Account account={account as AccountProps} />,
    );

    expect(getByTestId('table-data-value-3').textContent).toBe('Not offered');
  });

  it('renders formatted amount when unauthODMonthlyCap has a value', () => {
    const account = createAccount({
      unauthODMonthlyCap: { amount: 50, currency: 'GBP', scale: 2 },
    });

    const { getByTestId } = render(
      <Account account={account as AccountProps} />,
    );

    expect(getByTestId('table-data-value-3').textContent).toBe('£50.00');
  });
});
